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

**Key Decisions:**
- Use SEXUS field for gender identification
- Document only verified data (no estimates)
- Add absolute numbers alongside all percentages
- TODO file is descriptive reference (non-binding)
- Script paths relative to project root
- Exclude .claude/ from version control

---
