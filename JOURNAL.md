# HerData Project Journal

## Preamble

**Purpose:** This journal documents all significant project decisions, discoveries, corrections, and development steps for the HerData project. Every session with Claude Code should add entries here to maintain a continuous record of the project's evolution.

**Guidelines for entries:**
- Start each entry with date and time in format `YYYY-MM-DD HH:MM`
- Be concise and precise - focus on decisions and outcomes, not process
- Document what was changed, why it was changed, and the result
- Include key statistics, file changes, and technical discoveries
- Mark critical decisions with 🔴, corrections with ✏️, discoveries with 💡

---

## 2025-10-19

### 16:00 - Project Initialization & Data Verification

**Context:** First comprehensive analysis of HerData codebase and data sources.

**Actions:**
1. Analyzed complete folder structure:
   - `data/ra-cmif.xml` (333,557 lines, 9.5 MB)
   - `data/SNDB/` (14 XML files, 32 MB total)
   - `preprocessing/analyze_goethe_letters.py`
   - `knowledge/` (3 empty .md files)

2. ✏️ **Fixed preprocessing script path:**
   - **Problem:** Script looked for `preprocessing/data/ra-cmif.xml` (wrong)
   - **Solution:** Changed to `../data/ra-cmif.xml` (parent directory)
   - **Result:** Script runs successfully, generates `data/analysis-report.md`

3. **Executed Python analysis:**
   - Confirmed: **15,312 letters** in CMIF dataset (1762-1824)
   - Extracted: 2,525 unique senders, 633 places, 67,665 person mentions
   - GND coverage: 93.8% (senders), 82.5% (mentioned persons)

4. **Counted SNDB entities systematically:**
   - 27,835 entries → **23,571 unique person IDs**
   - 💡 **Critical discovery:** Field name is `SEXUS` (not `GESCHLECHT`)
   - Counted all 14 files (see statistics below)

### 16:30 - Major Data Corrections

**Critical corrections based on verified counts:**

| Entity | Old (estimated) | New (verified) | Source |
|--------|-----------------|----------------|--------|
| **Women** | ~4,300 (17.9%) | **3,617 (15.3%)** | `pers_koerp_indiv.xml` count |
| **Men** | Not documented | **16,572 (70.3%)** | Same source |
| **No gender data** | Not documented | **3,382 (14.3%)** | Same source |
| **Places** | Not documented | **4,007** | `geo_main.xml` |
| **Relationships** | Not documented | **6,580** | `pers_koerp_beziehungen.xml` |
| **Occupations** | Not documented | **29,375** | `pers_koerp_berufe.xml` |
| **Location assignments** | Not documented | **21,058** | `pers_koerp_orte.xml` |
| **AGRELON types** | Mentioned | **44** | `nsl_agrelon.xml` |
| **GND coverage (SNDB)** | "85% general" | **53.4%** (12,596/23,571) | `pers_koerp_indiv.xml` |

**Project-specific data:**
- `projekt_goebriefe.xml`: 6,790 entries
- `projekt_regestausgabe.xml`: 20,128 entries (largest!)
- `projekt_bug.xml`: 2,254 entries
- `projekt_tagebuch.xml`: 1,004 entries

### 17:00 - Documentation Updates

**Updated 3 knowledge files with verified statistics:**

1. **knowledge/data.md** (8 changes):
   - Corrected women count: 4,300 → 3,617
   - Fixed field name: GESCHLECHT → SEXUS
   - Added all entity counts (places, relationships, occupations)
   - Differentiated GND coverage (53.4% SNDB vs 93.8% CMIF)
   - Expanded AGRELON ontology description
   - Added absolute numbers to all percentages

2. **knowledge/project.md** (4 changes):
   - Updated SNDB overview with verified statistics
   - Corrected pipeline Phase 1 (3,617 women, not 4,300)
   - Updated MVP scalability (3,617 target)
   - Added supplementary data counts

3. **knowledge/research-context.md** (2 changes):
   - Added absolute numbers to temporal distribution (7,196 letters 1810-1824)
   - Added absolute numbers to geographic concentration (5,236 Weimar, 2,338 Jena)

### 17:30 - TODO Documentation Created

**Created:** `knowledge/TODO-Dokumentation.md`

**Documented 8 remaining tasks:**
- 🔴 High priority (3): AGRELON ontology, LFDNR semantics, DTD schemas
- 🟡 Medium priority (2): Example persons, Project XML details
- 🟢 Low priority (3): Data export process, API tests, Geo files

**Estimated effort:** 16-26 hours total

### 18:00 - Git Repository Setup

**Actions:**
1. Created `.gitignore`:
   - Excluded: `.claude/`, `nul`, Python cache, IDE files
   - Included: All data files (under 50 MB total)

2. 🔴 **Initial commit created:**
   - **Commit ID:** `dbef54b`
   - **Files:** 22 changed, 1,469,502 insertions
   - **Message:** "Initial commit: HerData project with verified datasets"
   - **Branch:** `main`

3. **Pushed to GitHub:**
   - **Repository:** https://github.com/chpollin/HerData
   - **Status:** ✅ Successfully pushed

**What was committed:**
- All data files (CMIF + 14 SNDB files)
- Analysis report (generated)
- 4 Knowledge files (3 updated, 1 new TODO)
- Corrected Python script
- .gitignore configuration

### 18:30 - Project Journal Created

**Created:** `JOURNAL.md` (this file)
- Documented entire session (16:00-18:30)
- Established guidelines for future entries
- Recorded all key decisions and statistics

---

## Key Decisions Log

### Data Management
- 🔴 **2025-10-19:** Keep all XML data in repository (under 50 MB, manageable)
- 🔴 **2025-10-19:** Exclude `.claude/` directory from version control
- 🔴 **2025-10-19:** Use SEXUS field (not GESCHLECHT) for gender identification

### Documentation Strategy
- 🔴 **2025-10-19:** Maintain separate TODO file for tracking remaining work
- 🔴 **2025-10-19:** Add absolute numbers alongside all percentages in documentation
- 🔴 **2025-10-19:** Document verified data only (no estimates without verification)

### Technical Decisions
- 🔴 **2025-10-19:** Python script paths relative to project root (not preprocessing dir)
- 🔴 **2025-10-19:** Generate analysis reports into `data/` directory

---

## Statistics Snapshot (2025-10-19)

**CMIF Dataset:**
- Letters: 15,312
- Senders: 2,525 unique
- Places: 633 unique
- Timespan: 1762-1824 (64 years)
- Person mentions: 67,665 (14,425 unique)
- GND coverage: 93.8% (senders), 82.5% (mentions)

**SNDB Dataset:**
- Total entries: 27,835
- Unique IDs: 23,571
- Women: 3,617 (15.3%)
- Men: 16,572 (70.3%)
- No gender: 3,382 (14.3%)
- GND coverage: 53.4% (12,596/23,571)
- Places: 4,007
- Relationships: 6,580
- Occupations: 29,375 entries
- AGRELON types: 44

---

## Next Session TODO

**Priority for next session:**
1. LFDNR semantics investigation (critical for data quality)
2. AGRELON ontology full documentation (needed for network analysis)
3. DTD schemas completion (foundation for data extraction)

**Optional:**
- Create README.md for GitHub
- Add LICENSE file (CC BY 4.0?)
- Consider creating example person profiles (Christiane Vulpius, etc.)

---

*End of 2025-10-19 session*
