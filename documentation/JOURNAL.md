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
- Merged and updated IMPLEMENTATION_PLAN.md with comprehensive 7-day sprint, actual results, code examples
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

**Session 4 - Frontend Implementation (Day 3)**
- Created directory structure: docs/css/, docs/js/, docs/assets/
- Implemented index.html with navigation, filters, map container (semantic HTML5)
- Built CSS design system: responsive breakpoints, typography scale, spacing system
- Added compact data validation script (40 lines): validates JSON structure without processing
- Created favicon.svg to eliminate 404 errors
- Validation confirms: 3,617 women loaded, 1,042 with geodata, all checks pass
- Zero console errors, clean browser console
- Responsive design: mobile (≤640px), tablet (≤1024px), desktop (>1024px)
- Initial commit: 860ebce (4 files, 509 lines added)

**Session 4 (continued) - Design Refinement and Decision Documentation**
- Refactored color scheme from purple gradient to professional academic navy blue
- Updated design.md with section 6.1.1 Farbpalette (Academic Professional)
- Defined navy blue (#1e3a5f) primary, steel blue (#2c5f8d) accents
- Updated CSS variables, removed gradient from navbar, updated badge colors
- Updated JavaScript success/error message colors to match design system
- Simplified favicon to solid navy blue (no gradient)
- Rationale: academic resources require serious, trustworthy visual language
- Commit: 8d8c896 (4 files changed, 75 insertions, 32 deletions)

**Session 4 (continued) - Architecture Decision Record**
- Moved JOURNAL.md to documentation/ folder for better organization
- Created knowledge/decisions.md with ADR-001 for map library selection
- Comprehensive comparison: Leaflet.js vs MapLibre GL JS vs OpenLayers
- Analysis of Phase 2/3 requirements (brushing, linking, animations, heatmap)
- Decision criteria: bundle size, open-source, DH adoption, Phase 2+ feasibility
- Recommendation: MapLibre GL JS for WebGL rendering and advanced features
- Trade-offs documented: 220 KB bundle (vs 40 KB Leaflet), steeper learning curve
- Rationale: Phase 2 brushing/linking easier with WebGL, native heatmap, future-proof
- Commits: f579aba (JOURNAL.md move), 5290160 (ADR document, 201 lines)

**Session 5 - MapLibre MVP Implementation**
- Analyzed complete project structure: data pipeline complete, frontend at 10%
- Created comprehensive step-by-step analysis: 6 phases covering documentation, code, tests, status
- Key findings: 3,617 women extracted, 808 matched to CMIF, 1,042 with geodata (28.8%)
- Identified gap: map rendering not implemented, only data validation
- Made decision: MapLibre GL JS over Leaflet for WebGL rendering and Phase 2 foundation
- Replaced Leaflet CDN references with MapLibre GL JS 4.7.1 in index.html
- Implemented complete map initialization with OpenStreetMap raster tiles
- Built GeoJSON conversion from persons.json (1,042 features with geodata)
- Added clustering: clusterMaxZoom=14, clusterRadius=50, step-based sizing
- Implemented three-layer rendering: clusters, cluster counts, individual markers
- Applied data-driven styling with role-based colors (sender/mentioned/both/indirect)
- Added zoom-based marker sizing (4px at z5, 12px at z15)
- Implemented click handlers: zoom on clusters, popups on markers
- Built popup templates with person data, badges (GND/SNDB), stats, location
- Connected filter system: role and normierung checkboxes update map in real-time
- Implemented tab switching with map resize on Karte tab activation
- Added loading states, error handling, stats display in navbar
- Updated CSS for MapLibre popup styling (removed Leaflet-specific styles)
- Finalized ADR-001: MapLibre GL JS accepted with implementation details
- Updated docs/README.md with local testing instructions and tech stack
- Total implementation: 419 lines JavaScript, fully functional MVP
- Commit: e75156a (4 files, 480 insertions, 58 deletions)

**Technical Details:**
- Map center: Weimar (11.3235, 50.9795) at zoom 5
- Navigation controls added (top-right)
- Cursor changes on hover (pointer for clusters and markers)
- Filter logic: roleMatch checks person.roles array and person.role field
- Layer management: remove existing layers/sources before re-rendering
- Performance: instant filter updates via layer re-rendering (no map reload)

**ADR-001 Final Decision:**
- MapLibre GL JS chosen for superior WebGL performance
- 220 KB bundle size acceptable (negligible vs 1.5 MB data)
- Native clustering with smooth transitions
- Data-driven styling cleaner than custom icons
- Better foundation for Phase 2 brushing and linking
- Trade-offs: larger bundle, WebGL requirement (acceptable for modern browsers)

**Bugfixes (Session 5 continued):**
- Fixed glyphs error: added glyphs property to map style for text rendering
- Fixed font 404 error: changed text-font from 'Open Sans Semibold' to 'Noto Sans Regular'
- Result: cluster count labels render correctly without console errors
- Commits: 97a2869 (glyphs fix), c2860bd (font fix)
- Map fully functional: 1,042 markers, clustering working, filters active, zero errors

**Session 6 - Clustering Improvements and Multi-Person Popup Implementation**
- Updated README.md with live GitHub Pages deployment link
- Marked GitHub Pages deployment as complete in project status
- Updated citation with author name and live URL
- Fixed JOURNAL.md path reference (moved to documentation/ folder)

**Clustering Optimization (Commit: 734908d):**
- Reduced clusterMaxZoom from 14 to 10 (clusters break apart earlier)
- Reduced clusterRadius from 50 to 40 (less aggressive clustering)
- Increased marker sizes: zoom 5 (4px→6px), zoom 10 (8px→10px), zoom 15 (12px→16px)
- Rationale: Users reported difficulty seeing individual entries at city level
- Result: Individual markers now visible at zoom 10 (city/neighborhood level)

**Multi-Person Popup Implementation (ADR-002, Commit: 9014a40):**
- Problem identified: 217 women in Weimar share identical coordinates (121 in Berlin, 61 in Frankfurt)
- Users could only click topmost marker, missing 99% of entries at same location
- Critical usability issue preventing data discovery

**Solution: Multi-person popup with location grouping**
- Modified click handler to use queryRenderedFeatures() for all markers at point
- Single marker: shows single-person popup (unchanged behavior)
- Multiple markers: shows scrollable list of all people at location
- Displays first 15 entries with "Zeige alle X Frauen" button for expansion
- Each entry shows: name, dates, GND/SNDB badges, letter/mention stats

**Technical Implementation:**
- Created showMultiPersonPopup() function for locations with 2+ people
- Renamed showPopup() to showSinglePersonPopup() for clarity
- Added expandPersonList() function for "Show all" button functionality
- Stores features in map._currentPopupFeatures for expansion
- Popup maxWidth: 400px, scrollable list max-height: 400px

**CSS Styling:**
- Multi-person popup container with responsive padding
- Person list with custom scrollbar (6px width, rounded)
- Person items with hover effects (background color transition)
- Show-more button with academic color scheme (steel blue)
- Mobile-friendly scrollable design

**Architecture Decision Record (ADR-002):**
- Documented in knowledge/decisions.md (212 lines)
- Analyzed 4 alternatives: spiderfy plugin, multi-person popup, coordinate jittering, increased clustering
- Decision: Multi-person popup for better UX, mobile-friendliness, no dependencies
- Trade-off: Deviates from original "Spiderfier" spec in requirements.md
- Rationale: Better for target audience (general public), historical data characteristics (city-level coordinates), academic context
- Future consideration: Can add spiderfy later if user testing shows need

**Testing Results:**
- Weimar popup: Shows "217 Frauen • Wirkungsort" with scrollable list
- Berlin popup: Shows "121 Frauen"
- Frankfurt popup: Shows "61 Frauen"
- Single markers work correctly with original popup
- Scroll and expand functionality smooth
- Performance: queryRenderedFeatures() fast, popup rendering instant

**Key Commits:**
- 734908d: Clustering improvements and README updates
- 9014a40: Multi-person popup implementation with ADR-002

---
