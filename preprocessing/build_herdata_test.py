"""
Test suite for HerData pipeline (build_herdata.py)

Testing strategy:
1. Unit tests: Test individual phase functions
2. Integration tests: Test full pipeline execution
3. Data validation: Verify output quality and correctness
4. Sample tests: Test with known examples
5. Edge cases: Test boundary conditions

Run with: python build_herdata_test.py
"""

import json
import sys
from pathlib import Path
from collections import Counter

# Import the pipeline
from build_herdata import HerDataPipeline


class HerDataTester:
    """Comprehensive test suite for HerData pipeline"""

    def __init__(self):
        self.tests_passed = 0
        self.tests_failed = 0
        self.failures = []

    def assert_test(self, condition, test_name, message=""):
        """Assert a test condition and track results"""
        if condition:
            self.tests_passed += 1
            print(f"  [PASS] {test_name}")
            return True
        else:
            self.tests_failed += 1
            self.failures.append(f"{test_name}: {message}")
            print(f"  [FAIL] {test_name}: {message}")
            return False

    def assert_range(self, value, min_val, max_val, test_name):
        """Assert value is within expected range"""
        message = f"Expected {min_val}-{max_val}, got {value}"
        return self.assert_test(min_val <= value <= max_val, test_name, message)

    # ================================================================
    # TEST 1: Pipeline Execution
    # ================================================================

    def test_pipeline_execution(self):
        """Test that pipeline executes without errors"""
        print("\n[TEST 1] Pipeline Execution")
        print("-" * 60)

        try:
            script_dir = Path(__file__).parent
            data_dir = script_dir.parent / 'data'
            output_file = script_dir.parent / 'docs' / 'data' / 'persons_test.json'

            pipeline = HerDataPipeline(data_dir, output_file, verbose=False)
            output_data = pipeline.run()

            self.assert_test(True, "Pipeline executes without exceptions")
            self.assert_test(output_data is not None, "Pipeline returns output data")

            # Cleanup test file
            if output_file.exists():
                output_file.unlink()

            return pipeline, output_data

        except Exception as e:
            self.assert_test(False, "Pipeline executes without exceptions", str(e))
            return None, None

    # ================================================================
    # TEST 2: Phase 1 - Women Identification
    # ================================================================

    def test_phase1_women_count(self, pipeline):
        """Test Phase 1: Correct number of women extracted"""
        print("\n[TEST 2] Phase 1 - Women Identification")
        print("-" * 60)

        if not pipeline:
            print("  [SKIP] Pipeline not available")
            return

        total = len(pipeline.women)
        self.assert_range(total, 3600, 3650, "Total women count ~3,617")

        # Expected exact count
        if total == 3617:
            self.assert_test(True, "Exact count matches 3,617")

    def test_phase1_gnd_coverage(self, pipeline):
        """Test Phase 1: GND coverage within expected range"""
        if not pipeline:
            return

        with_gnd = sum(1 for w in pipeline.women.values() if w.get('gnd'))
        gnd_pct = with_gnd / len(pipeline.women) * 100

        self.assert_range(gnd_pct, 30, 40, "GND coverage 30-40% (women-specific)")

    def test_phase1_dates_coverage(self, pipeline):
        """Test Phase 1: Date coverage within expected range"""
        if not pipeline:
            return

        with_dates = sum(1 for w in pipeline.women.values()
                        if w.get('dates', {}).get('birth') or w.get('dates', {}).get('death'))
        date_pct = with_dates / len(pipeline.women) * 100

        self.assert_range(date_pct, 75, 90, "Date coverage 75-90%")

    def test_phase1_data_quality(self, pipeline):
        """Test Phase 1: Data quality checks"""
        if not pipeline:
            return

        # Check no duplicate IDs
        ids = [w['id'] for w in pipeline.women.values()]
        unique_ids = set(ids)
        self.assert_test(len(ids) == len(unique_ids), "No duplicate person IDs")

        # Check all women have names
        without_names = sum(1 for w in pipeline.women.values() if not w.get('name'))
        self.assert_test(without_names == 0, "All women have names")

        # Check birth dates precede death dates (for post-1000 CE dates)
        # Note: Ancient figures (Cleopatra, Livia) have BCE dates represented as small positive numbers
        date_errors = 0
        for w in pipeline.women.values():
            birth = w.get('dates', {}).get('birth')
            death = w.get('dates', {}).get('death')
            if birth and death:
                try:
                    birth_yr = int(birth)
                    death_yr = int(death)
                    # Only check post-1000 CE dates (ancient dates may be BCE)
                    if birth_yr > 1000 and death_yr > 1000:
                        if birth_yr > death_yr:
                            date_errors += 1
                except ValueError:
                    pass

        self.assert_test(date_errors == 0, f"Birth dates precede death dates for post-1000 CE (errors: {date_errors})")

    # ================================================================
    # TEST 3: Phase 2 - CMIF Letter Matching
    # ================================================================

    def test_phase2_letter_matching(self, pipeline):
        """Test Phase 2: CMIF letter matching"""
        print("\n[TEST 3] Phase 2 - CMIF Letter Matching")
        print("-" * 60)

        if not pipeline:
            return

        with_letters = sum(1 for w in pipeline.women.values()
                          if w.get('letter_count', 0) > 0 or w.get('mention_count', 0) > 0)

        self.assert_test(with_letters > 0, "At least some women matched to CMIF")

        # Expected range: 700-900 women
        self.assert_range(with_letters, 700, 900, "CMIF matches 700-900 women")

    def test_phase2_role_assignment(self, pipeline):
        """Test Phase 2: Role assignment correctness"""
        if not pipeline:
            return

        senders = sum(1 for w in pipeline.women.values() if 'sender' in w.get('roles', []))
        mentioned = sum(1 for w in pipeline.women.values() if 'mentioned' in w.get('roles', []))

        self.assert_test(senders > 0, "At least some women are senders")
        self.assert_test(mentioned > 0, "At least some women are mentioned")

        # Expected: more mentioned than senders (historical pattern)
        self.assert_test(mentioned > senders, "More women mentioned than as senders")

    def test_phase2_role_consistency(self, pipeline):
        """Test Phase 2: Role field consistency"""
        if not pipeline:
            return

        inconsistencies = 0
        for w in pipeline.women.values():
            role = w.get('role')
            roles = w.get('roles', [])

            # Check role consistency
            if role == 'sender' and 'sender' not in roles:
                inconsistencies += 1
            elif role == 'mentioned' and 'mentioned' not in roles:
                inconsistencies += 1
            elif role == 'both' and len(roles) != 2:
                inconsistencies += 1
            elif role == 'indirect' and len(roles) != 0:
                inconsistencies += 1

        self.assert_test(inconsistencies == 0, f"Role field consistent with roles array (errors: {inconsistencies})")

    # ================================================================
    # TEST 4: Phase 3 - Data Enrichment
    # ================================================================

    def test_phase3_geodata_enrichment(self, pipeline):
        """Test Phase 3: Geodata enrichment"""
        print("\n[TEST 4] Phase 3 - Data Enrichment")
        print("-" * 60)

        if not pipeline:
            return

        with_geodata = sum(1 for w in pipeline.women.values() if w.get('places') and len(w['places']) > 0)
        geo_pct = with_geodata / len(pipeline.women) * 100

        self.assert_range(geo_pct, 20, 40, "Geodata coverage 20-40%")

    def test_phase3_coordinate_validity(self, pipeline):
        """Test Phase 3: Coordinate validity"""
        if not pipeline:
            return

        invalid_coords = 0
        for w in pipeline.women.values():
            for place in w.get('places', []):
                lat = place.get('lat')
                lon = place.get('lon')

                # Check valid ranges
                if lat is not None and (lat < -90 or lat > 90):
                    invalid_coords += 1
                if lon is not None and (lon < -180 or lon > 180):
                    invalid_coords += 1

        self.assert_test(invalid_coords == 0, f"All coordinates valid (errors: {invalid_coords})")

    def test_phase3_occupation_enrichment(self, pipeline):
        """Test Phase 3: Occupation data"""
        if not pipeline:
            return

        with_occupations = sum(1 for w in pipeline.women.values() if w.get('occupations') and len(w['occupations']) > 0)
        occ_pct = with_occupations / len(pipeline.women) * 100

        self.assert_range(occ_pct, 20, 35, "Occupation coverage 20-35%")

    # ================================================================
    # TEST 5: Phase 4 - JSON Output
    # ================================================================

    def test_phase4_json_structure(self, output_data):
        """Test Phase 4: JSON output structure"""
        print("\n[TEST 5] Phase 4 - JSON Output")
        print("-" * 60)

        if not output_data:
            return

        # Check required top-level fields
        self.assert_test('meta' in output_data, "JSON has 'meta' field")
        self.assert_test('persons' in output_data, "JSON has 'persons' field")

        # Check meta fields
        meta = output_data.get('meta', {})
        required_meta = ['generated', 'total_women', 'with_gnd', 'with_geodata', 'gnd_coverage_pct', 'geodata_coverage_pct', 'data_sources']
        for field in required_meta:
            self.assert_test(field in meta, f"Meta has '{field}' field")

    def test_phase4_person_structure(self, output_data):
        """Test Phase 4: Person object structure"""
        if not output_data or not output_data.get('persons'):
            return

        # Check first person has required fields
        person = output_data['persons'][0]
        required_fields = ['id', 'name', 'role', 'normierung', 'sndb_url']

        for field in required_fields:
            self.assert_test(field in person, f"Person has required field '{field}'")

    def test_phase4_normierung_consistency(self, output_data):
        """Test Phase 4: Normierung field consistency"""
        if not output_data or not output_data.get('persons'):
            return

        inconsistencies = 0
        for person in output_data['persons']:
            norm = person.get('normierung')
            has_gnd = person.get('gnd') is not None

            # If normierung='gnd', must have GND ID
            if norm == 'gnd' and not has_gnd:
                inconsistencies += 1
            # If has GND ID, normierung should be 'gnd'
            if has_gnd and norm != 'gnd':
                inconsistencies += 1

        self.assert_test(inconsistencies == 0, f"Normierung consistent with GND presence (errors: {inconsistencies})")

    def test_phase4_count_consistency(self, output_data):
        """Test Phase 4: Count consistency between meta and data"""
        if not output_data:
            return

        meta_count = output_data.get('meta', {}).get('total_women', 0)
        actual_count = len(output_data.get('persons', []))

        self.assert_test(meta_count == actual_count,
                        f"Meta total_women matches actual count ({meta_count} vs {actual_count})")

    # ================================================================
    # TEST 6: Known Examples Validation
    # ================================================================

    def test_known_examples(self, output_data):
        """Test with known historical examples"""
        print("\n[TEST 6] Known Examples Validation")
        print("-" * 60)

        if not output_data or not output_data.get('persons'):
            return

        # Create lookup by name
        by_name = {p['name'].lower(): p for p in output_data['persons']}

        # Test case 1: Christiane Vulpius (Goethe's wife - should exist)
        # Note: Name might vary, so we search for "vulpius"
        vulpius_found = any('vulpius' in name for name in by_name.keys())
        self.assert_test(vulpius_found, "Known person: Vulpius family member found")

        # Test case 2: Check for reasonable name patterns
        empty_names = sum(1 for p in output_data['persons'] if not p.get('name') or p['name'].strip() == '')
        self.assert_test(empty_names == 0, "No persons with empty names")

    # ================================================================
    # TEST 7: Data Statistics Validation
    # ================================================================

    def test_statistics_accuracy(self, pipeline, output_data):
        """Test statistical accuracy of metadata"""
        print("\n[TEST 7] Statistical Accuracy")
        print("-" * 60)

        if not pipeline or not output_data:
            return

        meta = output_data.get('meta', {})

        # Verify GND coverage percentage
        with_gnd = sum(1 for p in output_data['persons'] if p.get('gnd'))
        expected_gnd_pct = round(with_gnd / len(output_data['persons']) * 100, 1)
        actual_gnd_pct = meta.get('gnd_coverage_pct', 0)

        self.assert_test(abs(expected_gnd_pct - actual_gnd_pct) < 0.2,
                        f"GND coverage percentage accurate ({expected_gnd_pct}% vs {actual_gnd_pct}%)")

        # Verify geodata coverage percentage
        with_geo = sum(1 for p in output_data['persons'] if p.get('places'))
        expected_geo_pct = round(with_geo / len(output_data['persons']) * 100, 1)
        actual_geo_pct = meta.get('geodata_coverage_pct', 0)

        self.assert_test(abs(expected_geo_pct - actual_geo_pct) < 0.2,
                        f"Geodata coverage percentage accurate ({expected_geo_pct}% vs {actual_geo_pct}%)")

    # ================================================================
    # TEST 8: Performance and Size
    # ================================================================

    def test_performance(self):
        """Test pipeline performance"""
        print("\n[TEST 8] Performance and Size")
        print("-" * 60)

        import time

        script_dir = Path(__file__).parent
        data_dir = script_dir.parent / 'data'
        output_file = script_dir.parent / 'docs' / 'data' / 'persons_test.json'

        start_time = time.time()

        try:
            pipeline = HerDataPipeline(data_dir, output_file, verbose=False)
            pipeline.run()

            duration = time.time() - start_time

            # Should complete in under 5 seconds
            self.assert_test(duration < 5.0, f"Pipeline completes in <5s (took {duration:.2f}s)")

            # Check file size (should be under 2 MB)
            if output_file.exists():
                file_size_mb = output_file.stat().st_size / (1024 * 1024)
                self.assert_test(file_size_mb < 2.0, f"Output file <2 MB (is {file_size_mb:.2f} MB)")

                # Cleanup
                output_file.unlink()

        except Exception as e:
            self.assert_test(False, "Performance test executes", str(e))

    # ================================================================
    # TEST 9: Edge Cases
    # ================================================================

    def test_edge_cases(self, output_data):
        """Test edge cases and boundary conditions"""
        print("\n[TEST 9] Edge Cases")
        print("-" * 60)

        if not output_data or not output_data.get('persons'):
            return

        # Test: No person with negative letter counts
        negative_counts = sum(1 for p in output_data['persons']
                             if p.get('letter_count', 0) < 0 or p.get('mention_count', 0) < 0)
        self.assert_test(negative_counts == 0, "No negative letter/mention counts")

        # Test: Persons with role='sender' have letter_count > 0
        sender_without_letters = sum(1 for p in output_data['persons']
                                    if p.get('role') == 'sender' and p.get('letter_count', 0) == 0)
        self.assert_test(sender_without_letters == 0, "Senders have letter_count > 0")

        # Test: Persons with role='mentioned' have mention_count > 0
        mentioned_without_mentions = sum(1 for p in output_data['persons']
                                        if p.get('role') == 'mentioned' and p.get('mention_count', 0) == 0)
        self.assert_test(mentioned_without_mentions == 0, "Mentioned persons have mention_count > 0")

        # Test: Very old dates are acceptable (ancient historical figures exist)
        # But check they're not unreasonably ancient (pre-1 CE would be small numbers or BCE)
        ancient_figures = 0
        for p in output_data['persons']:
            birth = p.get('dates', {}).get('birth')
            if birth:
                try:
                    birth_yr = int(birth)
                    # Count ancient figures (before year 1000)
                    if birth_yr < 1000:
                        ancient_figures += 1
                except ValueError:
                    pass

        # Ancient figures should be rare but present (Cleopatra, Livia, etc.)
        self.assert_test(ancient_figures < 50, f"Ancient figures (<1000 CE) reasonable count: {ancient_figures} found")
        print(f"  Note: {ancient_figures} ancient historical figures found (expected, includes Cleopatra, Livia, etc.)")

    # ================================================================
    # TEST 10: Data Completeness
    # ================================================================

    def test_data_completeness(self, output_data):
        """Test data completeness and coverage"""
        print("\n[TEST 10] Data Completeness")
        print("-" * 60)

        if not output_data or not output_data.get('persons'):
            return

        # Count persons with different data types
        with_dates = sum(1 for p in output_data['persons'] if p.get('dates'))
        with_places = sum(1 for p in output_data['persons'] if p.get('places'))
        with_occupations = sum(1 for p in output_data['persons'] if p.get('occupations'))
        with_gnd = sum(1 for p in output_data['persons'] if p.get('gnd'))
        with_roles = sum(1 for p in output_data['persons'] if p.get('roles'))

        total = len(output_data['persons'])

        # At least some data should exist
        self.assert_test(with_dates > 0, f"At least some persons have dates ({with_dates}/{total})")
        self.assert_test(with_places > 0, f"At least some persons have places ({with_places}/{total})")
        self.assert_test(with_occupations > 0, f"At least some persons have occupations ({with_occupations}/{total})")
        self.assert_test(with_gnd > 0, f"At least some persons have GND ({with_gnd}/{total})")

        # Report coverage
        print(f"\n  Coverage Summary:")
        print(f"    Dates: {with_dates}/{total} ({with_dates/total*100:.1f}%)")
        print(f"    Places: {with_places}/{total} ({with_places/total*100:.1f}%)")
        print(f"    Occupations: {with_occupations}/{total} ({with_occupations/total*100:.1f}%)")
        print(f"    GND: {with_gnd}/{total} ({with_gnd/total*100:.1f}%)")

    # ================================================================
    # Run All Tests
    # ================================================================

    def run_all_tests(self):
        """Execute all test suites"""
        print("\n" + "="*60)
        print("HERDATA PIPELINE TEST SUITE")
        print("="*60)

        # Test 1: Pipeline execution
        pipeline, output_data = self.test_pipeline_execution()

        # Test 2-3: Phase 1 and 2
        self.test_phase1_women_count(pipeline)
        self.test_phase1_gnd_coverage(pipeline)
        self.test_phase1_dates_coverage(pipeline)
        self.test_phase1_data_quality(pipeline)

        self.test_phase2_letter_matching(pipeline)
        self.test_phase2_role_assignment(pipeline)
        self.test_phase2_role_consistency(pipeline)

        # Test 4: Phase 3
        self.test_phase3_geodata_enrichment(pipeline)
        self.test_phase3_coordinate_validity(pipeline)
        self.test_phase3_occupation_enrichment(pipeline)

        # Test 5: Phase 4
        self.test_phase4_json_structure(output_data)
        self.test_phase4_person_structure(output_data)
        self.test_phase4_normierung_consistency(output_data)
        self.test_phase4_count_consistency(output_data)

        # Test 6-10: Additional validation
        self.test_known_examples(output_data)
        self.test_statistics_accuracy(pipeline, output_data)
        self.test_performance()
        self.test_edge_cases(output_data)
        self.test_data_completeness(output_data)

        # Final report
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_failed}")
        print(f"Total tests:  {self.tests_passed + self.tests_failed}")

        if self.tests_failed > 0:
            print(f"\nFailed tests:")
            for failure in self.failures:
                print(f"  - {failure}")
            print("\n[RESULT] TESTS FAILED")
            sys.exit(1)
        else:
            print("\n[RESULT] ALL TESTS PASSED")
            sys.exit(0)


def main():
    """Run test suite"""
    tester = HerDataTester()
    tester.run_all_tests()


if __name__ == '__main__':
    main()
