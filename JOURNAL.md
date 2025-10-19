# HerData Project Journal

## Preamble

This journal documents project decisions, data discoveries, and development steps. Each entry is one line: date/time + action/decision + outcome. Critical decisions marked 🔴, corrections ✏️, discoveries 💡.

---

## 2025-10-19

**16:00** - Analyzed project structure: CMIF data (333k lines), 14 SNDB files (32 MB), Python script, 3 empty .md files
**16:15** - ✏️ Fixed script path from `preprocessing/data/` to `../data/` → script now runs
**16:20** - Executed analysis script → generated `data/analysis-report.md` with 15,312 letters verified
**16:25** - Counted SNDB systematically → 23,571 unique person IDs (27,835 total entries)
**16:30** - 💡 Discovered field name is `SEXUS` not `GESCHLECHT` in DTD
**16:35** - ✏️ Corrected women count: ~4,300 (estimated) → 3,617 verified (15.3%)
**16:40** - Counted all entities: 4,007 places, 6,580 relationships, 29,375 occupations, 21,058 location assignments
**16:45** - ✏️ Corrected GND coverage: "85% general" → 53.4% SNDB (12,596/23,571), 93.8% CMIF senders
**17:00** - Updated `knowledge/data.md`: women count, SEXUS field, entity counts, GND differentiation (8 changes)
**17:10** - Updated `knowledge/project.md`: SNDB overview, pipeline Phase 1, MVP target (4 changes)
**17:15** - Updated `knowledge/research-context.md`: added absolute numbers to percentages (2 changes)
**17:30** - Created `knowledge/TODO-Dokumentation.md` with 8 identified documentation gaps
**18:00** - Created `.gitignore` excluding `.claude/`, `nul`, Python cache
**18:10** - 🔴 Initial commit `dbef54b`: 22 files, 1.47M insertions → pushed to GitHub
**18:20** - Created `JOURNAL.md` documenting session 16:00-18:30
**18:25** - Commit `2c00e00`: Added JOURNAL.md → pushed
**18:40** - ✏️ Refactored TODO-Dokumentation.md to neutral/reporting style (removed priorities, time estimates)
**18:45** - Commit `b896dc7`: Neutral TODO documentation → pushed

---

## Key Decisions

**Data:**
🔴 **2025-10-19 18:00** - Keep all XML data in repo (under 50 MB)
🔴 **2025-10-19 16:30** - Use SEXUS field for gender (not GESCHLECHT)
🔴 **2025-10-19 16:35** - Document only verified data (no estimates)

**Documentation:**
🔴 **2025-10-19 17:30** - Maintain TODO file for identified gaps (non-binding)
🔴 **2025-10-19 17:00** - Add absolute numbers alongside all percentages
🔴 **2025-10-19 18:40** - TODO file is descriptive reference, not task list

**Technical:**
🔴 **2025-10-19 16:15** - Script paths relative to project root
🔴 **2025-10-19 18:00** - Exclude `.claude/` from version control

---

*Session ended 2025-10-19 18:50*
