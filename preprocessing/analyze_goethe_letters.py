"""
Deep Analysis of CMIF Letters to Goethe Dataset
Generates a comprehensive report on the correspondence metadata.
"""

import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from datetime import datetime
import re
from pathlib import Path

# Namespace for TEI
NS = {'tei': 'http://www.tei-c.org/ns/1.0'}

class GoetheCMIFAnalyzer:
    def __init__(self, xml_file):
        print(f"Loading XML file: {xml_file}")
        self.tree = ET.parse(xml_file)
        self.root = self.tree.getroot()
        self.correspondences = self.root.findall('.//tei:correspDesc', NS)

        # Data containers
        self.senders = []
        self.sender_counts = Counter()
        self.places = []
        self.place_counts = Counter()
        self.dates = []
        self.exact_dates = []
        self.date_ranges = []
        self.mentioned_persons = []
        self.mentioned_persons_counts = Counter()
        self.mentioned_bibls = []
        self.mentioned_orgs = []
        self.languages = []
        self.has_tei_file = 0
        self.has_transcription = 0
        self.has_abstract = 0
        self.text_base_types = Counter()

        print(f"Found {len(self.correspondences)} correspondence entries")

    def extract_gnd_id(self, url):
        """Extract GND ID from URL"""
        if url and 'gnd/' in url:
            return url.split('gnd/')[-1]
        return None

    def extract_geonames_id(self, url):
        """Extract GeoNames ID from URL"""
        if url and 'geonames.org/' in url:
            return url.split('geonames.org/')[-1]
        return None

    def parse_date(self, date_str):
        """Parse ISO date string to year"""
        if date_str:
            return int(date_str[:4])
        return None

    def analyze(self):
        """Perform deep analysis of all correspondence entries"""
        print("\nAnalyzing correspondence entries...")

        for idx, corresp in enumerate(self.correspondences):
            if (idx + 1) % 1000 == 0:
                print(f"  Processed {idx + 1} entries...")

            # Analyze sent action
            sent_action = corresp.find('.//tei:correspAction[@type="sent"]', NS)
            if sent_action:
                # Sender
                sender = sent_action.find('.//tei:persName', NS)
                if sender is not None:
                    sender_name = sender.text
                    sender_ref = sender.get('ref', '')
                    self.senders.append({
                        'name': sender_name,
                        'ref': sender_ref,
                        'gnd': self.extract_gnd_id(sender_ref)
                    })
                    self.sender_counts[sender_name] += 1

                # Place
                place = sent_action.find('.//tei:placeName', NS)
                if place is not None:
                    place_name = place.text
                    place_ref = place.get('ref', '')
                    self.places.append({
                        'name': place_name,
                        'ref': place_ref,
                        'geonames': self.extract_geonames_id(place_ref)
                    })
                    self.place_counts[place_name] += 1

                # Date
                date = sent_action.find('.//tei:date', NS)
                if date is not None:
                    when = date.get('when')
                    not_before = date.get('notBefore')
                    not_after = date.get('notAfter')

                    if when:
                        self.exact_dates.append(when)
                        self.dates.append(self.parse_date(when))
                    elif not_before and not_after:
                        self.date_ranges.append({
                            'notBefore': not_before,
                            'notAfter': not_after
                        })
                        # Use middle of range for stats
                        year = self.parse_date(not_before)
                        if year:
                            self.dates.append(year)

            # Analyze notes
            note = corresp.find('.//tei:note', NS)
            if note is not None:
                # Mentioned persons
                for ref in note.findall('.//tei:ref[@type="cmif:mentionsPerson"]', NS):
                    person_name = ref.text
                    person_ref = ref.get('target', '')
                    self.mentioned_persons.append({
                        'name': person_name,
                        'ref': person_ref,
                        'gnd': self.extract_gnd_id(person_ref)
                    })
                    if person_name:
                        self.mentioned_persons_counts[person_name] += 1

                # Mentioned bibliographic items
                for ref in note.findall('.//tei:ref[@type="cmif:mentionsBibl"]', NS):
                    if ref.text:
                        self.mentioned_bibls.append(ref.text)

                # Mentioned organizations
                for ref in note.findall('.//tei:ref[@type="cmif:mentionsOrg"]', NS):
                    if ref.text:
                        self.mentioned_orgs.append(ref.text)

                # Languages
                for ref in note.findall('.//tei:ref[@type="cmif:hasLanguage"]', NS):
                    lang = ref.get('target', '')
                    if lang:
                        self.languages.append(lang)

                # TEI file availability
                if note.find('.//tei:ref[@type="cmif:isAvailableAsTEIfile"]', NS) is not None:
                    self.has_tei_file += 1

                # Publication types
                for ref in note.findall('.//tei:ref[@type="cmif:isPublishedWith"]', NS):
                    pub_type = ref.get('target', '')
                    if 'Transcription' in pub_type:
                        self.has_transcription += 1
                    elif 'Abstract' in pub_type:
                        self.has_abstract += 1

                # Text base types
                for ref in note.findall('.//tei:ref[@type="cmif:hasTextBase"]', NS):
                    text_base = ref.get('target', '')
                    if text_base:
                        self.text_base_types[text_base] += 1

        print(f"  Completed analysis of {len(self.correspondences)} entries\n")

    def generate_report(self, output_file):
        """Generate comprehensive analysis report"""
        total = len(self.correspondences)

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("# DEEP ANALYSIS REPORT: Letters to Goethe (1762-1824)\n\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

            # DATASET OVERVIEW
            f.write("## 1. DATASET OVERVIEW\n\n")
            f.write(f"- Total Letters: {total:,}\n")
            f.write(f"- Unique Senders: {len(set(s['name'] for s in self.senders if s['name'])):,}\n")
            f.write(f"- Unique Places: {len(set(p['name'] for p in self.places if p['name'])):,}\n")
            f.write(f"- Time Span: {min(self.dates)} - {max(self.dates)} ({max(self.dates) - min(self.dates)} years)\n\n")

            # TEMPORAL ANALYSIS
            f.write("## 2. TEMPORAL ANALYSIS\n\n")

            # Date precision
            exact_count = len(self.exact_dates)
            range_count = len(self.date_ranges)
            f.write(f"### Date Precision\n")
            f.write(f"- Exact dates: {exact_count:,} ({exact_count/total*100:.1f}%)\n")
            f.write(f"- Date ranges: {range_count:,} ({range_count/total*100:.1f}%)\n\n")

            # Letters per decade
            f.write(f"### Letters by Decade\n\n")
            decade_counts = Counter()
            for year in self.dates:
                decade = (year // 10) * 10
                decade_counts[decade] += 1

            f.write("| Decade | Count | Percentage | Bar |\n")
            f.write("|--------|-------|------------|-----|\n")
            for decade in sorted(decade_counts.keys()):
                count = decade_counts[decade]
                pct = count / total * 100
                bar = '█' * int(pct / 2)
                f.write(f"| {decade}s | {count:,} | {pct:.1f}% | {bar} |\n")
            f.write("\n")

            # Letters per year (top 10)
            f.write(f"### Top 10 Years by Letter Count\n\n")
            year_counts = Counter(self.dates)
            f.write("| Year | Letters |\n")
            f.write("|------|--------|\n")
            for year, count in year_counts.most_common(10):
                f.write(f"| {year} | {count:,} |\n")
            f.write("\n")

            # SENDER ANALYSIS
            f.write("## 3. SENDER ANALYSIS\n\n")
            f.write(f"### Top 30 Correspondents\n\n")
            f.write("| Rank | Sender | Letters | % of Total |\n")
            f.write("|------|--------|---------|------------|\n")
            for idx, (sender, count) in enumerate(self.sender_counts.most_common(30), 1):
                pct = count / total * 100
                f.write(f"| {idx} | {sender} | {count:,} | {pct:.2f}% |\n")
            f.write("\n")

            # Sender distribution stats
            sender_letter_counts = list(self.sender_counts.values())
            f.write(f"### Sender Distribution Statistics\n\n")
            f.write(f"- Mean letters per sender: {sum(sender_letter_counts)/len(sender_letter_counts):.1f}\n")
            f.write(f"- Median letters per sender: {sorted(sender_letter_counts)[len(sender_letter_counts)//2]}\n")
            f.write(f"- Max letters (single sender): {max(sender_letter_counts):,}\n")
            f.write(f"- Senders with 1 letter: {sum(1 for c in sender_letter_counts if c == 1):,}\n")
            f.write(f"- Senders with 10+ letters: {sum(1 for c in sender_letter_counts if c >= 10):,}\n")
            f.write(f"- Senders with 100+ letters: {sum(1 for c in sender_letter_counts if c >= 100):,}\n\n")

            # GEOGRAPHIC ANALYSIS
            f.write("## 4. GEOGRAPHIC ANALYSIS\n\n")
            f.write(f"### Top 20 Sending Locations\n\n")
            f.write("| Rank | Place | Letters | % of Total |\n")
            f.write("|------|-------|---------|------------|\n")
            for idx, (place, count) in enumerate(self.place_counts.most_common(20), 1):
                pct = count / total * 100
                f.write(f"| {idx} | {place} | {count:,} | {pct:.2f}% |\n")
            f.write("\n")

            # MENTIONED PERSONS
            f.write("## 5. MENTIONED PERSONS ANALYSIS\n\n")
            f.write(f"- Total person mentions: {len(self.mentioned_persons):,}\n")
            f.write(f"- Unique persons mentioned: {len(self.mentioned_persons_counts):,}\n")
            letters_with_person_mentions = sum(1 for c in self.correspondences if c.find('.//tei:ref[@type="cmif:mentionsPerson"]', NS) is not None)
            f.write(f"- Letters with person mentions: {letters_with_person_mentions:,}\n\n")

            f.write(f"### Top 20 Most Mentioned Persons\n\n")
            f.write("| Rank | Person | Mentions |\n")
            f.write("|------|--------|----------|\n")
            for idx, (person, count) in enumerate(self.mentioned_persons_counts.most_common(20), 1):
                f.write(f"| {idx} | {person} | {count:,} |\n")
            f.write("\n")

            # BIBLIOGRAPHIC MENTIONS
            f.write("## 6. BIBLIOGRAPHIC MENTIONS\n\n")
            f.write(f"- Total bibliographic mentions: {len(self.mentioned_bibls):,}\n")
            f.write(f"- Unique works mentioned: {len(set(self.mentioned_bibls)):,}\n")
            letters_with_bibl_mentions = sum(1 for c in self.correspondences if c.find('.//tei:ref[@type="cmif:mentionsBibl"]', NS) is not None)
            f.write(f"- Letters with bibliographic mentions: {letters_with_bibl_mentions:,}\n\n")

            if self.mentioned_bibls:
                bibl_counts = Counter(self.mentioned_bibls)
                f.write(f"### Top 10 Most Mentioned Works\n\n")
                for idx, (work, count) in enumerate(bibl_counts.most_common(10), 1):
                    # Truncate long titles
                    work_short = work[:80] + '...' if len(work) > 80 else work
                    f.write(f"{idx}. {work_short} ({count} mentions)\n")
                f.write("\n")

            # ORGANIZATION MENTIONS
            f.write("## 7. ORGANIZATION MENTIONS\n\n")
            f.write(f"- Total organization mentions: {len(self.mentioned_orgs):,}\n")
            f.write(f"- Unique organizations: {len(set(self.mentioned_orgs)):,}\n")
            letters_with_org_mentions = sum(1 for c in self.correspondences if c.find('.//tei:ref[@type="cmif:mentionsOrg"]', NS) is not None)
            f.write(f"- Letters with org mentions: {letters_with_org_mentions:,}\n\n")

            if self.mentioned_orgs:
                org_counts = Counter(self.mentioned_orgs)
                f.write(f"### Most Mentioned Organizations\n\n")
                for idx, (org, count) in enumerate(org_counts.most_common(10), 1):
                    f.write(f"{idx}. {org} ({count} mentions)\n")
                f.write("\n")

            # LANGUAGE ANALYSIS
            f.write("## 8. LANGUAGE DISTRIBUTION\n\n")
            lang_counts = Counter(self.languages)
            f.write("| Language | Letters | Percentage |\n")
            f.write("|----------|---------|------------|\n")
            for lang, count in lang_counts.most_common():
                pct = count / total * 100
                f.write(f"| {lang} | {count:,} | {pct:.1f}% |\n")
            f.write("\n")

            # PUBLICATION STATUS
            f.write("## 9. PUBLICATION & AVAILABILITY STATUS\n\n")
            f.write(f"- Letters with TEI file available: {self.has_tei_file:,} ({self.has_tei_file/total*100:.1f}%)\n")
            f.write(f"- Letters with transcription: {self.has_transcription:,} ({self.has_transcription/total*100:.1f}%)\n")
            f.write(f"- Letters with abstract: {self.has_abstract:,} ({self.has_abstract/total*100:.1f}%)\n\n")

            f.write("### Text Base Types\n\n")
            for text_base, count in self.text_base_types.most_common():
                pct = count / total * 100
                f.write(f"- {text_base}: {count:,} ({pct:.1f}%)\n")
            f.write("\n")

            # NETWORK DENSITY
            f.write("## 10. CORRESPONDENCE NETWORK INSIGHTS\n\n")

            # Calculate mentions per letter
            letters_with_mentions = sum(1 for c in self.correspondences
                                       if c.find('.//tei:ref[@type="cmif:mentionsPerson"]', NS) is not None)
            avg_mentions = len(self.mentioned_persons) / letters_with_mentions if letters_with_mentions > 0 else 0

            f.write(f"- Average persons mentioned per letter (when mentioned): {avg_mentions:.1f}\n")
            f.write(f"- Letters with no person mentions: {total - letters_with_mentions:,} ({(total - letters_with_mentions)/total*100:.1f}%)\n")

            # Calculate richness - letters with multiple metadata types
            rich_letters = 0
            for c in self.correspondences:
                note = c.find('.//tei:note', NS)
                if note is not None:
                    has_person = note.find('.//tei:ref[@type="cmif:mentionsPerson"]', NS) is not None
                    has_bibl = note.find('.//tei:ref[@type="cmif:mentionsBibl"]', NS) is not None
                    has_org = note.find('.//tei:ref[@type="cmif:mentionsOrg"]', NS) is not None
                    if sum([has_person, has_bibl, has_org]) >= 2:
                        rich_letters += 1

            f.write(f"- 'Rich' letters (with 2+ mention types): {rich_letters:,} ({rich_letters/total*100:.1f}%)\n\n")

            # KEY FINDINGS
            f.write("## 11. KEY FINDINGS\n\n")

            # Peak correspondence period
            peak_decade = max(decade_counts.items(), key=lambda x: x[1])
            f.write(f"1. Peak Period: The {peak_decade[0]}s saw the most correspondence ({peak_decade[1]:,} letters)\n\n")

            # Top correspondent
            top_sender = self.sender_counts.most_common(1)[0]
            f.write(f"2. Most Prolific Correspondent: {top_sender[0]} ({top_sender[1]:,} letters, {top_sender[1]/total*100:.1f}% of total)\n\n")

            # Geographic concentration
            top_place = self.place_counts.most_common(1)[0]
            f.write(f"3. Geographic Concentration: {top_place[0]} was the most common sending location ({top_place[1]:,} letters, {top_place[1]/total*100:.1f}%)\n\n")

            # Most mentioned person
            if self.mentioned_persons_counts:
                top_mentioned = self.mentioned_persons_counts.most_common(1)[0]
                f.write(f"4. Most Mentioned Person: {top_mentioned[0]} (mentioned in {top_mentioned[1]:,} letters)\n\n")

            # Data completeness
            f.write(f"5. Data Richness: {self.has_tei_file/total*100:.1f}% of letters have full TEI files available\n\n")

            # Temporal distribution
            early_letters = sum(1 for y in self.dates if y < 1790)
            late_letters = sum(1 for y in self.dates if y >= 1810)
            f.write(f"6. Temporal Distribution: Early period (pre-1790): {early_letters:,} letters; Late period (1810+): {late_letters:,} letters\n\n")

            # AUTHORITY COVERAGE
            f.write("## 12. AUTHORITY FILE COVERAGE\n\n")

            senders_with_gnd = sum(1 for s in self.senders if s['gnd'])
            places_with_geonames = sum(1 for p in self.places if p['geonames'])
            persons_with_gnd = sum(1 for p in self.mentioned_persons if p['gnd'])

            f.write(f"- Senders with GND ID: {senders_with_gnd:,} / {len(self.senders):,} ({senders_with_gnd/len(self.senders)*100:.1f}%)\n")
            f.write(f"- Places with GeoNames ID: {places_with_geonames:,} / {len(self.places):,} ({places_with_geonames/len(self.places)*100:.1f}%)\n")
            f.write(f"- Mentioned persons with GND ID: {persons_with_gnd:,} / {len(self.mentioned_persons):,} ({persons_with_gnd/len(self.mentioned_persons)*100:.1f}%)\n\n")

            f.write("---\n\n")
            f.write("*This report provides a comprehensive statistical overview of the CMIF dataset. ")
            f.write("For detailed querying methods, see the accompanying documentation file.*\n")

def main():
    xml_file = Path(__file__).parent.parent / 'data' / 'ra-cmif.xml'
    output_file = Path(__file__).parent.parent / 'data' / 'analysis-report.md'

    print("=" * 60)
    print("GOETHE LETTERS CMIF DATASET ANALYZER")
    print("=" * 60)

    analyzer = GoetheCMIFAnalyzer(xml_file)
    analyzer.analyze()

    print("Generating comprehensive report...")
    analyzer.generate_report(output_file)

    print(f"\n{'=' * 60}")
    print(f"[SUCCESS] Analysis complete!")
    print(f"[SUCCESS] Report saved to: {output_file}")
    print(f"{'=' * 60}\n")

if __name__ == '__main__':
    main()
