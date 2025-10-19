# HerData Preprocessing Scripts

This directory contains the data pipeline and testing infrastructure for the HerData project.

## Files

- `build_herdata.py` - Main data pipeline (4-phase extraction and enrichment)
- `build_herdata_test.py` - Comprehensive test suite (48 tests)
- `analyze_goethe_letters.py` - CMIF analysis script (statistical report generation)

## Pipeline Usage

### Build Complete Dataset

```bash
python build_herdata.py
```

Output: `docs/data/persons.json` (3,617 women, 1.49 MB)

Execution time: ~1.4 seconds

### Run Tests

```bash
python build_herdata_test.py
```

Runs 48 tests across 10 test categories. Exit code 0 if all pass, 1 if any fail.

### Generate CMIF Analysis Report

```bash
python analyze_goethe_letters.py
```

Output: `data/analysis-report.md` (statistical overview of 15,312 letters)

## Pipeline Architecture

### Phase 1: Identify Women from SNDB
- Extract all women (SEXUS='w') from SNDB database
- Load biographical data (names, GND IDs, life dates)
- Output: 3,617 women with 34.1% GND coverage, 83.9% with dates

### Phase 2: Match CMIF Letters
- Match women to CMIF letters via GND-ID (primary) and name (fallback)
- Identify roles: sender, mentioned, or both
- Output: 808 women matched (192 senders, 772 mentioned)

### Phase 3: Enrich with Geodata
- Add geographic coordinates from SNDB geo files
- Add occupation data from SNDB occupation files
- Output: 1,042 women with geodata (28.8%), 979 with occupations

### Phase 4: Generate JSON Output
- Merge all data sources into unified JSON structure
- Optimize file size (remove null fields)
- Output: `docs/data/persons.json` (1.49 MB)

## Test Suite

### Test Categories

1. Pipeline Execution (2 tests)
2. Phase 1 - Women Identification (7 tests)
3. Phase 2 - CMIF Letter Matching (6 tests)
4. Phase 3 - Data Enrichment (3 tests)
5. Phase 4 - JSON Output (8 tests)
6. Known Examples Validation (2 tests)
7. Statistical Accuracy (2 tests)
8. Performance and Size (2 tests)
9. Edge Cases (4 tests)
10. Data Completeness (4 tests)

Total: 48 tests

### Testing Strategy

- Unit tests: Individual phase functions
- Integration tests: Full pipeline execution
- Data validation: Output quality and correctness
- Sample tests: Known historical examples (Vulpius, Cleopatra, etc.)
- Edge cases: Boundary conditions and error handling
- Performance tests: Execution time and file size constraints

### Known Data Quirks

- Ancient historical figures (Cleopatra, Livia Drusilla, Octavia Minor) have BCE dates represented as small positive numbers (69, 58, etc.)
- Women have lower GND coverage (34.1%) than overall SNDB (53.4%) - reflects historical underrepresentation
- Only 22.3% of women appear in CMIF letters - most are in SNDB biographical data only

## Data Quality Checks

The pipeline includes inline validation at each phase:

- Expected count ranges (3,500-3,700 women)
- GND coverage percentages (25-50%)
- Date coverage percentages (75-90%)
- Geodata coverage percentages (20-80%)
- No duplicate IDs
- All persons have names
- Birth dates precede death dates (for post-1000 CE dates)
- Coordinates within valid ranges (lat: -90 to 90, lon: -180 to 180)
- Role consistency (sender/mentioned/both/indirect)

## Output Format

### JSON Structure

```json
{
  "meta": {
    "generated": "ISO timestamp",
    "total_women": 3617,
    "with_cmif_data": 808,
    "with_geodata": 1042,
    "with_gnd": 1235,
    "gnd_coverage_pct": 34.1,
    "geodata_coverage_pct": 28.8,
    "data_sources": {
      "cmif": "ra-cmif.xml (2025-03 snapshot)",
      "sndb": "SNDB export 2025-10"
    }
  },
  "persons": [
    {
      "id": "SNDB-ID",
      "name": "Display name",
      "role": "sender | mentioned | both | indirect",
      "normierung": "gnd | sndb",
      "sndb_url": "https://ores.klassik-stiftung.de/...",
      "gnd": "GND-ID (optional)",
      "roles": ["sender", "mentioned"] (optional),
      "letter_count": 0 (optional),
      "mention_count": 0 (optional),
      "dates": {
        "birth": "YYYY",
        "death": "YYYY"
      } (optional),
      "places": [
        {
          "name": "Place name",
          "lat": 50.9795,
          "lon": 11.3235,
          "type": "Geburtsort | Sterbeort | Wirkungsort"
        }
      ] (optional),
      "occupations": [
        {
          "name": "Occupation name",
          "type": "Beruf"
        }
      ] (optional)
    }
  ]
}
```

## Requirements

- Python 3.7+
- Standard library only (no external dependencies)
- Data files in `data/` directory (CMIF + SNDB XML files, 55.4 MB)

## Performance

- Pipeline execution: 1.39 seconds
- Test suite execution: 1.73 seconds
- Output file size: 1.49 MB (well under 10 MB GitHub Pages limit)

## Future Enhancements

- Add AGRELON relationship extraction (Phase 3 extension)
- Add biographical text extraction from projekt_*.xml files
- Implement chunked JSON output for very large datasets
- Add CI/CD integration (GitHub Actions)
- Add automated regression testing
