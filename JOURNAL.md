# HerData Project Journal

## Preamble

This journal documents project decisions and development steps. Each date entry aggregates all work done that day. Critical decisions marked separately.

---

## 2025-10-19

**Session 1 - Data Verification & Initial Documentation**
- Fixed script paths, executed CMIF analysis (15,312 letters verified)
- Counted SNDB entities: 23,571 persons (3,617 women/15.3%), 4,007 places, 6,580 relationships, 29,375 occupations
- Discovered correct field name: SEXUS (not GESCHLECHT)
- Corrected GND coverage: 53.4% SNDB, 93.8% CMIF senders
- Created complete documentation: data.md, project.md, research-context.md, TODO-Dokumentation.md
- Initial commit (dbef54b): 22 files pushed to GitHub
- Refactored TODO to neutral reporting style
- Created JOURNAL.md, refactored to compact format
- Created design.md with full UI/UX specification

**Session 2 - Project Overview & Repository Setup**
- Analyzed full project structure (knowledge docs, data files, preprocessing script)
- Created comprehensive README.md with complete file structure, data sources, statistics
- Set up docs/ folder for future GitHub Pages implementation (placeholder README only)
- Created requirements.md with 14 user stories (5 epics), 10 functional requirements, 3 implementation phases
- Refactored JOURNAL.md to compact format (date-based, aggregated sessions)
- Created IMPLEMENTATION_PLAN.md with 7-day detailed breakdown for Phase 1 MVP
- Created CLAUDE.md with documentation and code style guidelines (no bold, no emojis, no time estimates)

**Key Decisions:**
- Use SEXUS field for gender identification
- Document only verified data (no estimates)
- Add absolute numbers alongside all percentages
- TODO file is descriptive reference (non-binding)
- Script paths relative to project root
- Exclude .claude/ from version control

**Session 3 - Data Pipeline Implementation**
- Analyzed complete project structure: 95% documentation complete, data ready, code at 5%
- Created IMPLEMENTATION_PLAN_V2.md with comprehensive 7-day sprint breakdown
- Implemented build_herdata.py with 4-phase pipeline architecture
- Fixed XML field names: SEXUS (gender), ART+JAHR (dates), SNDB_ID (place links), BEZEICHNUNG (place names), LATITUDE/LONGITUDE (coordinates)
- Pipeline execution: 1.39 seconds total runtime
- Phase 1: Extracted 3,617 women (SEXUS='w'), 34.1% GND coverage, 83.9% with dates
- Phase 2: Matched 808 women to CMIF (192 senders, 772 mentioned via GND-ID + name fallback)
- Phase 3: Enriched 1,042 women with geodata (28.8%), 979 with occupations
- Phase 4: Generated docs/data/persons.json (1.49 MB, 3,617 entries)
- Implemented compact testing strategy: inline validation with assertions at each phase
- Fixed Windows console encoding (replaced Unicode checkmarks with [OK])

**Key Findings:**
- Women have lower GND coverage than overall SNDB (34.1% vs 53.4%)
- CMIF matching rate: 22.3% of women found in letters (808/3,617)
- Geodata coverage for women: 28.8% (lower than expected 60%, realistic)
- Occupation data available for 27% of women (979/3,617)
- JSON output optimized: removed null fields, 1.49 MB total
- Ancient historical figures present (9 persons <1000 CE: Cleopatra, Livia, etc.)

**Testing Implementation:**
- Created build_herdata_test.py with comprehensive test suite
- 48 tests across 10 categories: execution, phases 1-4, examples, statistics, performance, edge cases, completeness
- All tests pass: unit tests, integration tests, data validation, sample tests, performance tests
- Test execution: 1.73 seconds, validates pipeline outputs correctly
- Identified data quirks: BCE dates for ancient figures, birth/death date handling
- Created preprocessing/README.md with complete documentation

---
