# HerData Journal

## 2025-10-19

### Session 1: Data Verification & Initial Documentation
- Fixed script paths, verified CMIF (15,312 letters)
- Counted SNDB: 23,571 persons (3,617 women/15.3%), 4,007 places
- Discovered SEXUS field (not GESCHLECHT)
- GND coverage: 53.4% SNDB, 93.8% CMIF senders
- Created: data.md, project.md, research-context.md, TODO-Dokumentation.md
- Initial commit [dbef54b]: 22 files
- Refactored TODO to neutral reporting, created JOURNAL.md

### Session 2: Project Overview & Repository Setup  
- Analyzed project structure, created comprehensive README.md
- Set up docs/ for GitHub Pages (placeholder)
- Created requirements.md: 14 user stories, 5 epics, 10 functional requirements
- Created IMPLEMENTATION_PLAN.md: 7-day Phase 1 breakdown
- Created CLAUDE.md: style guidelines (no bold, no emojis, no time estimates)
- Decision: Exclude .claude/ from git, use relative paths

### Session 3: Data Pipeline Implementation
- Project status: 95% docs complete, 5% code
- Implemented build_herdata.py: 4-phase pipeline, 1.39s runtime
- Fixed XML fields: SEXUS, ART+JAHR, SNDB_ID, BEZEICHNUNG, LATITUDE/LONGITUDE
- Phase 1: Extracted 3,617 women, 34.1% GND, 83.9% with dates
- Phase 2: Matched 808 to CMIF (192 senders, 772 mentioned)
- Phase 3: Enriched 1,042 with geodata (28.8%), 979 with occupations
- Phase 4: Generated docs/data/persons.json (1.49 MB)
- Windows fix: [OK] instead of Unicode checkmarks
- Finding: Ancient figures (9 persons <1000 CE), women lower GND than average
- Created build_herdata_test.py: 48 tests, all passing, 1.73s execution

### Session 4: Frontend Implementation
- Created docs/ structure: css/, js/, assets/
- Implemented index.html: navigation, filters, map container
- Built CSS design system: responsive breakpoints, typography scale
- Added data validation script (40 lines), validates 3,617 women
- Created favicon.svg, zero console errors
- Responsive: mobile ≤640px, tablet ≤1024px, desktop >1024px
- Commit [860ebce]: 509 lines added

### Session 4 (continued): Design Refinement
- Changed purple gradient → academic navy blue (#1e3a5f)
- Updated design.md: section 6.1.1 Farbpalette
- Defined steel blue (#2c5f8d) for accents
- Simplified favicon to solid navy
- Rationale: academic resources need trustworthy visual language
- Commit [8d8c896]: 75 insertions, 32 deletions

### Session 4 (continued): Architecture Decision
- Moved JOURNAL.md to documentation/
- Created ADR-001 in decisions.md: MapLibre vs Leaflet vs OpenLayers
- Analysis: Phase 2/3 needs brushing, linking, animations, heatmap
- Decision: MapLibre GL JS for WebGL rendering
- Trade-offs: 220 KB bundle (vs 40 KB Leaflet), steeper learning curve
- Commits: [f579aba] move, [5290160] ADR (201 lines)

### Session 5: MapLibre MVP Implementation
- Analyzed status: pipeline complete, frontend 10%
- Replaced Leaflet CDN with MapLibre GL JS 4.7.1
- Implemented map: OSM tiles, center Weimar (11.3235, 50.9795)
- Built GeoJSON from persons.json: 1,042 features
- Added clustering: maxZoom=14, radius=50, step-based sizing
- Three layers: clusters, counts, individual markers
- Role-based colors: sender/mentioned/both/indirect
- Zoom-based markers: 4px→12px (z5→z15)
- Click handlers: zoom clusters, popup markers
- Connected filters to real-time map updates
- Tab switching with map resize on Karte activation
- Commit [e75156a]: 419 lines JavaScript, 480 insertions
- Bugfixes: glyphs property [97a2869], font fix [c2860bd]

### Session 6: Clustering Improvements & Multi-Person Popups
- Updated README.md with GitHub Pages link
- Reduced clusterMaxZoom 14→10 (clusters break earlier)
- Reduced clusterRadius 50→40 (less aggressive)
- Increased marker sizes: 6/10/16px (was 4/8/12px)
- Commit [734908d]: clustering optimization
- Problem: 217 women at Weimar coords, only top clickable
- Solution: queryRenderedFeatures() for all markers at point
- Implemented multi-person popup: 15 initial, expandable
- Created ADR-002 for decision documentation
- Commit [9014a40]: multi-person implementation

### Session 7: Search Implementation
- Added search bar to navigation
- Implemented fuzzy search with Fuse.js (threshold: 0.3)
- Searchable fields: name, name_variants, gnd_name
- Results dropdown: max 10, shows name + dates + badges
- Click behavior: zoom to location (z12) or show alert if no coords
- Keyboard: arrow navigation, enter to select, escape to close
- Auto-close on outside click
- Commit: search functionality complete

### Session 8: Statistics Dashboard
- Created Statistiken tab with 4 sections
- Overview cards: total, letters, geodata percentages
- Charts: role distribution (pie), top locations (bar), occupations (horizontal bar)
- Time analysis: birth/death year histograms
- Responsive grid layout, mobile-optimized
- Chart.js integration for visualizations
- Commit: statistics implementation

### Session 9: Research Interface Improvements
- User feedback: "Es soll ja ein Forschungsinterface sein"
- Problem: All clusters blue, no visual hierarchy
- Renamed filter: Rolle → Briefaktivität
- Removed filter: Normierung (GND/SNDB)
- Added filter: Berufsgruppe (7 occupation categories)
- 231 unique occupations → 7 groups: Künstlerisch (222), Literarisch (199), etc.
- Cluster colors by majority: blue=writers, green=mixed, gray=mentioned, light=SNDB
- Added legend: bottom-right, 4 color categories
- Enhanced tooltips: "111 Frauen | 45 geschrieben • 58 erwähnt • 8 SNDB"
- Commit [2f2479a]: research interface improvements

### Session 10: Timeline Visualization and Architecture Refinement

Initial Implementation (D3.js Timeline):
- Created timeline.js module (252 lines) with D3.js histogram
- 62-year visualization (1762-1824), bar chart
- Initial design: Brush selection (d3.brushX) for temporal filtering
- Commit [c452743]: 389 insertions, 4 files changed

Critical Bug Discovery and Fix:
- Problem: Timeline tried loading 23.4 MB ra-cmif.xml from docs/data/ (404 Not Found)
- Root Cause: File not in GitHub Pages deployment (too large)
- Lesson Learned: Tests didn't catch deployment issues (only tested pipeline logic)
- Solution: Extended data pipeline to extract letter_years during Phase 2
- Added letter_years array to each person in persons.json
- Added aggregated timeline data to meta.timeline (54 years with data)
- Timeline now loads from persons.json (1.56 MB) instead of XML
- Commit [9e1ae34]: Fixed data loading architecture

Architecture Revision (UX Improvement):
- Removed D3 brush selection from timeline (unfamiliar UI pattern)
- Replaced with hover tooltips for data exploration
- Moved temporal filtering to sidebar (consistent with other filters)
- Added dual-handle range slider using noUiSlider 15.7.1
- Single line display: "1762 – 1824" with two draggable handles
- Commit [ac1d6df]: Brush → Sidebar filter architecture change
- Commit [4137177]: Fixed hover tooltips (bar width, cursor pointer, z-index)
- Commit [edfcb00]: Integrated noUiSlider for professional UX

Final Implementation:
- Timeline: Pure visualization with hover tooltips
- Sidebar Filter: Year range slider (1762-1824)
- Brushing & Linking: Slider ↔ Map ↔ Timeline synchronization
- Performance: <500ms timeline render, <100ms filter updates (targets met)
- Data: 13,414 letters with dates, ~13,000 letter-year entries
- ADR-005: Status changed from Proposed → Implemented → Revised

Lessons Learned:
- Integration tests needed (deployment scenarios, not just pipeline)
- Frontend should use processed data (JSON), not raw data (XML)
- UX patterns: Consistency matters (sidebar filters > embedded controls)
- Iterate on feedback: Brush selection → Hover + Sidebar was better UX

Total Commits Session 10: 6 commits, ~500 lines changed