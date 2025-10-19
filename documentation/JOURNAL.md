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

**Session 7 - Person Detail Pages Implementation (Phase 2)**
- Implemented complete person detail page system with 6-tab structure
- URL-based routing: person.html?id=[SNDB-ID]
- Responsive design matching academic color scheme

**New Files Created:**
- docs/person.html - Person detail page template with tab navigation
- docs/js/person.js - Data loading, rendering, mini-map (487 lines)

**Tab Structure (6 Tabs):**

Tab 1 - Überblick (Overview):
- Person header: name, life dates, role badges, authority badges
- Statistics grid: letters sent, mentions, places count, occupations count
- Biography section (placeholder for Phase 2 SNDB projekt-XML extraction)

Tab 2 - Korrespondenz (Letters):
- Letter count and mention count summary
- Placeholder content for Phase 2 full letter details
- Note explaining data availability

Tab 3 - Orte (Places):
- Places grid with cards (name, type, coordinates)
- Interactive mini-map using MapLibre GL JS
- Markers for all person locations with popups
- Auto-fit bounds for multiple places
- Example: München (Wirkungsort) 48.13743°N, 11.57549°E

Tab 4 - Berufe (Occupations):
- Occupation cards in flexible grid
- Shows name and type (Beruf, Tätigkeit, Stand)
- Example: "Sängerin (Beruf)", "Schauspielerin (Beruf)"

Tab 5 - Netz (Network):
- Placeholder for Phase 2 network graph
- Lists planned features (AGRELON relationships, co-mentions)

Tab 6 - Quellen (Sources):
- GND link: https://d-nb.info/gnd/[ID] (if available)
- SNDB link: https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:[ID]
- Data quality section (normierung, dates, geodata, occupations status)
- Citation generator with person name, project info, URL, access date

**CSS Implementation (style.css +351 lines):**
- Person page container (max-width: 1200px, centered)
- Person header styling with badges
- Tab panels with fade-in animation
- Stats grid (4-column responsive, auto-fit minmax 200px)
- Places grid (auto-fill minmax 250px)
- Mini-map container (400px height, rounded borders, responsive)
- Occupation items (flex chips with type labels)
- Source links (word-break for long URLs)
- Citation text (monospace, bordered, academic style)
- Mobile breakpoints (2-column stats at 768px, 300px map height)

**JavaScript Implementation (person.js):**
- URL parameter parsing: new URLSearchParams(window.location.search)
- Data loading: fetch('data/persons.json') - all 3,617 women
- Person lookup: allPersons.find(p => p.id === personId)
- Tab switching with fade animation
- Mini-map initialization with OpenStreetMap tiles
- Auto-fit bounds for multiple locations
- Error handling (person not found, loading states)

**Popup Integration (app.js):**
- Made person-item clickable in multi-person popup
- onclick="window.location.href='person.html?id=${p.id}'"
- Works for both initial 15 entries and "Show all" expansion

**Access Points:**
- Click "Details →" in single-person popup (existing)
- Click person name in multi-person popup (new)
- Direct URL: person.html?id=[any SNDB-ID from 3,617 women]

**Testing Examples:**
- Anna Altmutter (ID 35267): 1 letter, 1 mention, München, 3 occupations
- Weimar popup: 217 women, all clickable to their detail pages
- Works with all 3,617 real women from SNDB/CMIF data

**Data Sources:**
- All data from docs/data/persons.json (no mock data)
- Names: SNDB pers_koerp_main.xml
- Dates: SNDB pers_koerp_datierungen.xml
- Places: SNDB pers_koerp_orte.xml + geo_*.xml
- Occupations: SNDB pers_koerp_berufe.xml
- Letters: CMIF ra-cmif.xml matching

**Performance:**
- Loads 1.49 MB persons.json once
- Instant rendering after data load
- Mini-map initializes only when Orte tab activated
- Smooth tab switching with CSS animations

**Phase 2 Future Enhancements:**
- Extract biographical texts from SNDB pers_koerp_projekt_*.xml
- Full letter list with dates, regests, TEI links
- Network graph visualization (AGRELON relationships)
- Timeline view for person's correspondence

**Key Commit:**
- 409a7a4: Person detail pages implementation (4 files, +901 lines)

---

# Session 8: Cluster Click Fix and Debugging System

**Date:** 2025-01-19
**Focus:** Fix cluster clicks not working, implement debugging system

## Problem Identified

User reported clicking on cluster circles (e.g., "14 Frauen", "218 Frauen") did nothing. Investigation revealed multiple issues:

1. Tooltip variable scope issue (clusterTooltip defined inside mouseenter handler)
2. Event handlers registered multiple times on filter changes
3. MapLibre getClusterLeaves() callback never executed

## Initial Fixes Attempted

**Fix 1: Tooltip Variable Scope (Commit 733b590)**
- Moved clusterTooltip and markerTooltip to renderMarkers function scope
- Click handler could now access and remove hover tooltips
- Problem: Still not working, handlers firing multiple times

**Fix 2: Tooltip Text Truncation (Commit 47f7fd2)**
- Added max-width: 250px and text-overflow: ellipsis
- Fixed long names like "Maria Theresia Antonina Josephine Tys..." overflowing
- CSS improvements for hover tooltips

## Debugging System Implementation

**Compact Logging Utility (Commit 3352958)**

Added color-coded console logging system:

```javascript
const log = {
    init: (msg) => console.log(`🟢 INIT: ${msg}`),
    render: (msg) => console.log(`🔵 RENDER: ${msg}`),
    event: (msg) => console.log(`🟡 EVENT: ${msg}`),
    click: (msg) => console.log(`🟠 CLICK: ${msg}`),
    error: (msg) => console.error(`🔴 ERROR: ${msg}`)
};
```

Logging added to:
- Application initialization and data loading
- renderMarkers (initial vs setData updates)
- Layer and event handler setup
- Cluster and marker click events with details
- Filter application

**Debug findings from browser console:**
- Click handler fired multiple times (2-4×) per click
- getClusterLeaves callback never executed (no "Callback executed" log)
- Confirmed MapLibre getClusterLeaves API incompatibility

## Architecture Refactoring

**Data-Driven Rendering (Commits c6a6323, final fix)**

Problem: renderMarkers() recreated layers and re-registered event handlers on every call

Solution implemented:

1. **Source Updates via setData():**
```javascript
if (map.getSource('persons')) {
    map.getSource('persons').setData(geojson); // Update data only
} else {
    map.addSource('persons', {...}); // Create source first time
}
```

2. **Separate Layer Creation:**
```javascript
function addMapLayers() {
    // Create cluster, label, and marker layers once
}
```

3. **Single Event Handler Registration:**
```javascript
let handlersSetup = false;

if (!handlersSetup) {
    setupEventHandlers();
    handlersSetup = true;
}
```

4. **Direct Data Filtering Instead of getClusterLeaves:**

MapLibre's getClusterLeaves() callback never executed. Solution: Filter persons directly from data:

```javascript
const personsAtLocation = filteredPersons.filter(person => {
    const place = person.places[0];
    const distance = Math.sqrt(
        Math.pow(place.lon - clusterCoords[0], 2) +
        Math.pow(place.lat - clusterCoords[1], 2)
    );
    return distance < 0.001; // ~100m radius
});
```

Convert to feature format and show popup:
```javascript
const features = personsAtLocation.map(person => ({
    properties: { id, name, role, gnd, dates, letter_count, ... }
}));
showMultiPersonPopup(lngLat, features);
```

## Final Behavior

**Cluster Click (≤50 persons):**
- Click cluster → filter persons by location from data
- Show multi-person popup with all persons at location
- Scrollable list, "Show all" button for >15 entries
- Each entry clickable → person detail page

**Cluster Click (>50 persons):**
- Click cluster → zoom in by 2 levels
- Cluster breaks apart into smaller clusters or individual markers

**Hover Tooltips:**
- Cluster: "X Frauen" (with ellipsis truncation for UI)
- Individual marker: "Name (birth–death)"
- Removed on click or mouseleave

## Console Log Output (Working)

```
🟢 INIT: Starting application
🟢 INIT: Loaded 3617 persons, 1042 with geodata
🟢 INIT: Application ready
🔵 RENDER: Creating source: 1042 markers (initial)
🔵 RENDER: Adding layers (first time)
🔵 RENDER: Setting up event handlers (first time)
🟡 EVENT: Registering event handlers
🟠 CLICK: Cluster clicked - processing...
🟠 CLICK: Cluster: 12 persons at [6.9585, 51.0414]
🟠 CLICK: Finding persons at cluster location from data (≤50 threshold)
🟠 CLICK: Found 12 persons at cluster location
```

Popup shows all 12 persons successfully.

## Technical Decisions

**Why not use getClusterLeaves?**
- MapLibre's geojson source getClusterLeaves callback never executed
- Likely requires Supercluster direct access (not available in MapLibre API)
- Direct data filtering more reliable and transparent

**Why separate handlersSetup flag?**
- Event handlers persist across layer updates
- Flag prevents duplicate registration on filter changes
- Cleaner than map.off() approach (no function references needed)

**Why 0.001° radius for location matching?**
- ~100m accuracy matches typical geocoding precision
- Accounts for slight coordinate variations in source data
- Small enough to avoid false positives

## Files Changed

- [docs/js/app.js](../docs/js/app.js): Refactored rendering, added logging, fixed cluster clicks
- [docs/css/style.css](../docs/css/style.css): Tooltip text truncation
- documentation/JOURNAL.md: This session documentation

## Key Commits

- 733b590: Fix tooltip variable scope
- 47f7fd2: Tooltip text truncation
- 3352958: Compact logging system
- c6a6323: Enhanced callback logging
- [final]: Data-driven rendering with direct person filtering

---
