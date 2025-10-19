# HerData Implementation Plan

Created: 2025-10-19
Updated: 2025-10-19 (Session 3 - Testing Complete)
Status: Day 1-2 COMPLETE - Data pipeline and tests implemented
Target: Phase 1 MVP (Week 1-2)

## Executive Summary

This plan details the implementation of HerData version 1.0, a web-based visualization platform that makes visible the 3,617 women in Johann Wolfgang von Goethe's correspondence network (1762-1824). The implementation follows a 7-day sprint structure, building a Python data pipeline and interactive frontend with map visualization, filtering, and basic person profiles.

## Current Implementation Status

### Completed (Days 1-2)

**Data Pipeline - COMPLETE**
- File: [preprocessing/build_herdata.py](preprocessing/build_herdata.py) (615 lines)
- 4-phase architecture: identify women, match letters, enrich data, generate JSON
- Results: 3,617 women extracted, 808 matched to CMIF (192 senders, 772 mentioned)
- Geodata: 1,042 women with coordinates (28.8%), 979 with occupations (27.1%)
- Output: [docs/data/persons.json](docs/data/persons.json) (1.49 MB)
- Execution time: 1.39 seconds
- All inline validations pass

**Testing Suite - COMPLETE**
- File: [preprocessing/build_herdata_test.py](preprocessing/build_herdata_test.py) (550 lines)
- 48 tests across 10 categories: execution, phases 1-4, examples, statistics, performance, edge cases, completeness
- All tests pass successfully
- Test execution: 1.73 seconds
- Documentation: [preprocessing/README.md](preprocessing/README.md)

### Completed (Days 3-5)

**Day 3-5: Frontend - COMPLETE**
- HTML/CSS structure with responsive layout (completed)
- MapLibre GL JS map with clustering (completed)
- Filtering system: role and normierung (completed)
- Tab navigation: Karte/Zeit/Netz (completed)
- Popup templates with person data (completed)
- Real-time filter updates (completed)
- Loading states and error handling (completed)

**Implementation Details:**
- Technology: MapLibre GL JS 4.7.1 (WebGL rendering)
- Data: 1,042 women with geodata displayed
- Clustering: clusterMaxZoom=14, clusterRadius=50
- Role colors: Steel Blue (sender), Medium Gray (mentioned), Forest Green (both), Light Gray (indirect)
- Performance: Instant filter updates, smooth transitions
- Commits: e75156a (main implementation), 97a2869 (glyphs fix), c2860bd (font fix)

### Completed (Day 6)

**Day 6: Usability Improvements and GitHub Pages Deployment - COMPLETE**
- Clustering optimization: clusterMaxZoom 14→10, clusterRadius 50→40
- Increased marker sizes for better visibility
- Multi-person popup implementation (ADR-002)
- Solves critical issue: 217 women in Weimar now accessible
- GitHub Pages deployment: https://chpollin.github.io/HerData/
- README.md updated with live demo links

### Completed (Day 7)

**Day 7: Person Detail Pages - COMPLETE**
- Implemented complete 6-tab person detail page system
- URL-based routing: person.html?id=[SNDB-ID]
- Interactive mini-map for person locations (MapLibre GL JS)
- All 3,617 women accessible with real data
- Clickable person names in multi-person popup
- Responsive design with mobile breakpoints
- Live example: https://chpollin.github.io/HerData/person.html?id=35267

### Completed (Day 8)

**Day 8: Cluster Click Debugging and Architecture Refactoring - COMPLETE**
- Fixed cluster clicks not working (tooltip scope, event handler duplication)
- Implemented debugging system with color-coded console logging
- Refactored to data-driven rendering (setData instead of layer recreation)
- Direct data filtering bypasses broken getClusterLeaves API
- All cluster interactions now functional
- Documentation: JOURNAL.md Session 8, commits 733b590-4cc66f3

### Completed (Day 9)

**Day 9: Research Interface Improvements - COMPLETE**
- Renamed filters for clarity: "Briefaktivität" instead of "Rolle"
- Added occupation group filter (7 categories: Künstlerisch, Literarisch, Musikalisch, Hof/Adel, Bildung, Sonstiges, Kein Beruf)
- Removed technical "Normierung (GND/SNDB)" filter
- Implemented cluster color encoding by letter activity (blue=wrote, gray=mentioned, green=mixed)
- Added map legend (bottom-right, 3 colors)
- Enhanced hover tooltips with composition breakdown
- Documentation: JOURNAL.md Session 9, decisions.md ADR-003, commits 2f2479a-638c50f

### Pending (Day 10+)

**Testing and Optimization - PENDING**
- [ ] Performance optimization (target: TTI ≤ 2s)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Lighthouse performance audit (target: 90+)

**Phase 2 Remaining Features - PENDING**
- [ ] Timeline view (D3.js histogram)
- [ ] Network graph visualization
- [ ] Full letter detail pages with regests
- [ ] Biographical text extraction from SNDB projekt-XML
- [ ] Unified search (typeahead)
- [ ] Brushing and linking (map ↔ timeline ↔ list)
- [ ] Story/narrative curation
- [ ] CSV export functionality

---

## Prerequisites

Data Files Available:
- `data/ra-cmif.xml` (24 MB, 15,312 letters)
- `data/SNDB/*.xml` (14 files, 32 MB, 23,571 persons)

Documentation Complete:
- [requirements.md](knowledge/requirements.md) - 14 user stories, 10 functional requirements
- [design.md](knowledge/design.md) - UI/UX specification
- [data.md](knowledge/data.md) - Complete data model
- [wireframe.md](knowledge/wireframe.md) - Technical UI spec

Tools Required:
- Python 3.x (for data pipeline)
- Git/GitHub (repository ready)
- Text editor/IDE

---

## Phase 1: MVP Implementation (Week 1-2)

Goal: Interactive map showing 3,617 women with basic filtering

Success Criteria:
- Map loads in <2s
- 3,617 women visible
- Subset with geodata shown as map markers (1,042 women)
- 2+ filters functional (Role, Normierung)
- Deployed to GitHub Pages

---

## Detailed 7-Day Implementation Plan

### Day 1: Data Pipeline Foundation (COMPLETE)

Goal: Extract all 3,617 women from SNDB and verify data quality

Implementation approach:
- Use xml.etree.ElementTree for XML parsing
- Implement 4-phase pipeline architecture
- Add comprehensive logging for debugging
- Include data quality validation at each phase

**Phase 1: load_sndb_women()**
Purpose: Identify all women in SNDB database

Data sources:
- data/SNDB/pers_koerp_main.xml (23,571 persons, IDs and names)
- data/SNDB/pers_koerp_indiv.xml (SEXUS field for gender, GND IDs)
- data/SNDB/pers_koerp_datierungen.xml (birth/death dates)

Logic:
1. Parse pers_koerp_main.xml to build ID → name mapping
2. Parse pers_koerp_indiv.xml to filter SEXUS='w' (women)
3. Extract GND IDs for authority file linkage
4. Parse pers_koerp_datierungen.xml for life dates (ART=Geburtsdatum/Sterbedatum, JAHR field)
5. Build data structure: {sndb_id: {name, gnd, birth, death}}

Actual results:
- 3,617 women identified (exact match)
- 34.1% with GND coverage (women have lower coverage than overall SNDB 53.4%)
- 83.9% with dates (3,034 women)
- Name variants preserved (LFDNR field indicates main vs variant)

**Phase 2: enrich_biographies()**
Data sources:
- data/SNDB/pers_koerp_berufe.xml (29,375 occupation entries)
- data/SNDB/pers_koerp_orte.xml (21,058 location assignments)

Logic:
1. Extract occupations with type (Beruf, Tätigkeit, Stand)
2. Extract associated places with type (Geburtsort, Sterbeort, Wirkungsort)
3. Store as arrays to preserve multiple entries

Actual results:
- 1,296 occupation entries added
- 979 women with occupation data (27.1%)

Validation checks:
- Total count matches expected 3,617
- GND coverage 25-50% (actual: 34.1%)
- No duplicate SNDB IDs
- Birth dates precede death dates (for post-1000 CE dates)

### Day 2: Letter Matching and Geodata Enrichment (COMPLETE)

Goal: Link women to CMIF letters and add geographic coordinates

**Task 2.1: match_cmif_letters()**
Data source:
- data/ra-cmif.xml (15,312 letters, 23.4 MB)

Matching algorithm:
- Primary: GND-ID exact match (most reliable, 93.8% coverage in CMIF)
- Fallback: Exact name match (case-insensitive)

Logic:
1. Parse CMIF correspDesc elements
2. Extract senders (correspAction type="sent" → persName@ref)
3. Extract mentions (correspDesc → mentionsPerson@target)
4. Match via GND-ID (primary) or name (fallback)
5. Store role: "sender" | "mentioned" | "both"
6. Count letters and mentions per woman

Actual results:
- 808 women matched to CMIF (22.3%)
- 192 women as senders
- 772 women as mentioned
- Women without matches remain in dataset (role: "indirect")

**Task 2.2: enrich_geodata()**
Data sources:
- data/SNDB/pers_koerp_orte.xml (person → place linkage, SNDB_ID field)
- data/SNDB/geo_main.xml (4,007 places, BEZEICHNUNG field)
- data/SNDB/geo_indiv.xml (LATITUDE/LONGITUDE fields)

Logic:
1. For each woman, get place IDs from pers_koerp_orte.xml
2. Look up place names in geo_main.xml (LFDNR=0 for main form)
3. Get coordinates from geo_indiv.xml
4. Store as array: [{name, lat, lon, type}]

Actual results:
- 1,042 women with place links (28.8%)
- 3,210 place names loaded
- 3,214 places with coordinates
- Primary place selection: Wirkungsort > Geburtsort > Sterbeort

**Task 2.3: build_persons_json()**
Output file: docs/data/persons.json (1.49 MB)

JSON structure:
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
      "dates": {"birth": "YYYY", "death": "YYYY"} (optional),
      "places": [{"name": "...", "lat": 50.9795, "lon": 11.3235, "type": "..."]} (optional),
      "occupations": [{"name": "...", "type": "Beruf"}] (optional)
    }
  ]
}
```

Optimization strategies:
- Remove null fields to reduce size (implemented)
- JSON size: 1.49 MB (well under 10 MB GitHub Pages limit)

---

### Day 3: Frontend HTML/CSS Structure (COMPLETE)

Goal: Build responsive layout with navigation, filters, and map container

**Status:** COMPLETE (Sessions 4-5)

Task 3.1: Create directory structure (COMPLETE)
- docs/index.html (main entry point)
- docs/css/style.css (main stylesheet)
- docs/css/variables.css (design tokens from design.md)
- docs/js/app.js (main application logic)
- docs/person.html (person detail page template)

Task 3.2: Implement HTML structure (COMPLETE)

**Actual Implementation:**
- [x] Semantic HTML5 structure
- [x] Global navigation with 7 areas (Entdecken, Personen, Briefe, Orte, Netzwerk, Kontext, Stories)
- [x] Live statistics display (3,617 Frauen, 15,312 Briefe, 633 Orte)
- [x] Sidebar with filter groups (Briefaktivität, Berufsgruppe)
- [x] Main content area with 3-tab view (Karte, Zeit, Netz)
- [x] MapLibre GL JS integration (replaced Leaflet, see ADR-001)
- [x] Responsive layout (mobile/tablet/desktop)

Original Plan Structure:
- Semantic HTML5 elements
- Global navigation with 7 areas (Entdecken, Personen, Briefe, Orte, Netzwerk, Kontext, Stories)
- Live statistics display (updated from data)
- Sidebar with filter groups
- Main content area with 3-tab view (Karte, Zeit, Netz)

HTML template:
```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HerData - Frauen in Goethes Briefkorrespondenz</title>

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />

    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Global Navigation -->
    <nav class="navbar">
        <div class="nav-brand">HerData</div>
        <div class="nav-links">
            <a href="#entdecken" class="active">Entdecken</a>
            <a href="#personen">Personen</a>
            <a href="#briefe">Briefe</a>
            <a href="#orte">Orte</a>
            <a href="#netzwerk">Netzwerk</a>
            <a href="#stories">Stories</a>
        </div>
        <div class="nav-stats">
            <span id="stat-letters">15.312 Briefe</span>
            <span id="stat-women">3.617 Frauen</span>
            <span id="stat-places">633 Orte</span>
        </div>
    </nav>

    <!-- Main Container -->
    <div class="container">
        <!-- Sidebar Filters -->
        <aside class="sidebar">
            <h3>Filter</h3>

            <!-- Role Filter -->
            <div class="filter-group">
                <h4>Rolle</h4>
                <label><input type="checkbox" name="role" value="sender" checked> Absenderin</label>
                <label><input type="checkbox" name="role" value="mentioned" checked> Erwähnt</label>
                <label><input type="checkbox" name="role" value="indirect"> Indirekt (SNDB)</label>
            </div>

            <!-- Normierung Filter -->
            <div class="filter-group">
                <h4>Normierung</h4>
                <label><input type="checkbox" name="normierung" value="gnd" checked> GND vorhanden</label>
                <label><input type="checkbox" name="normierung" value="sndb" checked> Nur SNDB</label>
            </div>

            <button id="reset-filters">Alle zurücksetzen</button>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <div class="tabs">
                <button class="tab active" data-tab="map">Karte</button>
                <button class="tab" data-tab="timeline">Zeit</button>
                <button class="tab" data-tab="network">Netz</button>
            </div>

            <div id="map-view" class="tab-content active">
                <div id="map"></div>
            </div>

            <div id="timeline-view" class="tab-content" style="display:none;">
                <p>Timeline wird in Phase 2 implementiert</p>
            </div>

            <div id="network-view" class="tab-content" style="display:none;">
                <p>Netzwerk wird in Phase 3 implementiert</p>
            </div>
        </main>
    </div>

    <!-- Scripts -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
    <script src="js/app.js" type="module"></script>
</body>
</html>
```

Task 3.3: Implement CSS design system (COMPLETE)

**Actual Implementation:**
- [x] Color system: Navy Blue (#1e3a5f), Steel Blue (#2c5f8d), Forest Green (#2d6a4f)
- [x] Typography: System font stack, 14px base, 1.6 line height
- [x] Spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- [x] Responsive breakpoints: Mobile ≤640px, Tablet ≤1024px, Desktop >1024px
- [x] CSS Grid and Flexbox layouts
- [x] CSS variables for theming
- [x] MapLibre CSS integration

Original Design tokens (from design.md):
- Colors: Primary palette (purple #667eea, pink #764ba2)
- Typography: Font sizes (12, 14, 16, 18, 24, 32, 48px)
- Spacing: Scale (4, 8, 12, 16, 24, 32, 48, 64, 96px)
- Breakpoints: Mobile ≤640px, Tablet ≤1024px, Desktop >1024px

Responsive behavior:
- Mobile (≤640px): Sidebar collapses to drawer, tabs stack vertically
- Tablet (≤1024px): Sidebar narrow, map scales proportionally
- Desktop (>1024px): Full layout with sidebar + map side-by-side

---

### Day 4: Map Implementation with MapLibre GL JS (COMPLETE)

Goal: Interactive map with marker clustering and popups

**Status:** COMPLETE (Sessions 4-5, ADR-001 MapLibre decision)

**Actual Implementation:**
- [x] MapLibre GL JS 4.7.1 (WebGL rendering)
- [x] OpenStreetMap raster tiles
- [x] Center: Weimar (11.3235, 50.9795), zoom 5
- [x] Navigation controls (zoom, pan)
- [x] Responsive map resizing on tab switches
- [x] Data-driven clustering (clusterMaxZoom=10, clusterRadius=40)
- [x] Cluster color encoding by letter activity (ADR-003)
- [x] Map legend (bottom-right, 3 colors)
- [x] Hover tooltips with composition breakdown
- [x] Debug logging system (color-coded console output)

Task 4.1: Initialize Leaflet map (REPLACED)
```javascript
// Load data
let allPersons = [];
let filteredPersons = [];

async function loadData() {
    const response = await fetch('data/persons.json');
    const data = await response.json();
    allPersons = data.persons;
    filteredPersons = allPersons;

    updateStats(data.meta);
    initMap();
}

// Initialize map
function initMap() {
    const map = L.map('map').setView([50.9795, 11.3235], 6); // Weimar

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create marker cluster group
    const markers = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true
    });

    renderMarkers(markers, filteredPersons);
    map.addLayer(markers);
}
```

Task 4.2: Render markers (COMPLETE - MapLibre implementation)
```javascript
function renderMarkers(clusterGroup, persons) {
    clusterGroup.clearLayers();

    persons.forEach(person => {
        if (!person.places || person.places.length === 0) return;

        const place = person.places[0]; // Primary place
        const marker = L.marker([place.lat, place.lon], {
            icon: getMarkerIcon(person.role)
        });

        marker.bindPopup(createPopup(person));
        clusterGroup.addLayer(marker);
    });
}

function getMarkerIcon(role) {
    const colors = {
        'sender': '#667eea',
        'mentioned': '#764ba2',
        'both': '#ffd700',
        'indirect': '#999'
    };

    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${colors[role]}"></div>`,
        iconSize: [12, 12]
    });
}
```

Task 4.3: Create popup content (COMPLETE with enhancements)

**Actual Implementation:**
- [x] Single-person popups with name, dates, badges, stats
- [x] Multi-person popups for overlapping locations (ADR-002)
- [x] Clickable person names linking to person.html?id=[SNDB-ID]
- [x] Scrollable lists showing first 15 entries
- [x] "Zeige alle X Frauen" expansion button
- [x] Academic color scheme and styling
```javascript
function createPopup(person) {
    const dates = person.dates
        ? `(${person.dates.birth || '?'} – ${person.dates.death || '?'})`
        : '';

    return `
        <div class="popup">
            <h3>${person.name} ${dates}</h3>
            <div class="popup-badges">
                ${person.gnd ? '<span class="badge badge-gnd">GND</span>' : ''}
                <span class="badge badge-sndb">SNDB</span>
            </div>
            <div class="popup-stats">
                ${person.letter_count ? `<p><strong>${person.letter_count}</strong> Briefe</p>` : ''}
                ${person.mention_count ? `<p><strong>${person.mention_count}</strong> Erwähnungen</p>` : ''}
            </div>
            <a href="person.html?id=${person.id}">Details →</a>
        </div>
    `;
}
```

---

### Day 5: Filtering System Implementation (COMPLETE)

Goal: Interactive filters that update map in real-time

**Status:** COMPLETE (Sessions 5, 9 - renamed and enhanced)

**Actual Implementation:**
- [x] Briefaktivität filter (renamed from "Rolle")
  - [x] Hat geschrieben (192 women, checked by default)
  - [x] Wurde erwähnt (772 women, checked by default)
  - [x] Nur SNDB-Eintrag (2,809 women, unchecked by default)
- [x] Berufsgruppe filter (7 categories, Session 9 new)
  - [x] Künstlerisch (~440 women)
  - [x] Literarisch (~226 women)
  - [x] Musikalisch (~183 women)
  - [x] Hof/Adel (~100 women)
  - [x] Bildung (~45 women)
  - [x] Sonstiges (other occupations)
  - [x] Kein Beruf angegeben (2,638 women)
- [x] Removed "Normierung (GND/SNDB)" filter (Session 9 - technical, not research-relevant)
- [x] Real-time map updates via setData()
- [x] Instant filter response (<50ms)
- [x] "Alle zurücksetzen" button

Original Filter dimensions:
1. Role filter (checkbox group): Absenderin, Erwähnt, Indirekt
2. Normierung filter (checkbox group): GND vorhanden, Nur SNDB

Filter logic:
```javascript
function applyFilters() {
    const roleFilters = getCheckedValues('role');
    const normierungFilters = getCheckedValues('normierung');

    filteredPersons = allPersons.filter(person => {
        const roleMatch = roleFilters.some(r =>
            person.roles && person.roles.includes(r) || person.role === r
        );
        const normierungMatch = normierungFilters.includes(person.normierung);

        return roleMatch && normierungMatch;
    });

    updateMap(filteredPersons);
    updateStats();
}

// Attach event listeners
document.querySelectorAll('input[name="role"], input[name="normierung"]')
    .forEach(input => input.addEventListener('change', applyFilters));
```

---

### Day 6: Testing and Optimization (PARTIAL)

**Status:** PARTIAL - Performance excellent, formal testing pending

Task 6.1: Performance optimization (COMPLETE)

**Actual Results:**
- [x] JSON size: 1.49 MB (well optimized)
- [x] Map render time: <1 second
- [x] Filter update time: <50ms (instant)
- [x] Time to Interactive (TTI): ~2 seconds
- [x] Data-driven rendering for smooth updates
- [x] GPU-accelerated clustering (MapLibre)
- [ ] Lighthouse audit (pending)
- [ ] Gzip compression testing (pending)

Original Target metrics:
- Time to Interactive (TTI) ≤ 2 seconds
- Map render time ≤ 1 second
- Filter update time ≤ 100ms

Optimization strategies:
- JSON minification (already optimized: 1.49 MB)
- Gzip compression for persons.json
- Debounce filter updates (150ms)
- Use requestAnimationFrame for smooth marker updates

Task 6.2: Cross-browser testing (PENDING)
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Test: Map rendering, markers, clustering, popups, filters

Task 6.3: Mobile responsiveness (COMPLETE for design, PENDING for testing)
- [x] Responsive design implemented (mobile/tablet/desktop)
- [x] Mobile breakpoints: ≤640px
- [x] Sidebar collapses to drawer on mobile
- [x] Touch-friendly button sizes (48px minimum)
- [x] Map auto-resize on orientation change
- [ ] Physical device testing: iPhone SE, iPhone 12, iPad, Samsung Galaxy S20
- [ ] Touch gesture testing
- [ ] Filter tappability testing

---

### Day 7: Documentation and Deployment (COMPLETE)

**Status:** COMPLETE (Session 6-7)

Task 7.1: Update documentation (COMPLETE)
- [x] README.md: Deployment URL, live demo, implementation status
- [x] JOURNAL.md: Sessions 1-9 documented (~770 lines)
- [x] knowledge/decisions.md: 3 ADRs (MapLibre, Multi-person popup, Cluster colors)
- [x] IMPLEMENTATION_PLAN.md: Daily progress updates
- [x] preprocessing/README.md: Pipeline and test documentation
- [ ] CHANGELOG.md (v0.1.0) - pending

Task 7.2: GitHub Pages deployment (COMPLETE)
- [x] All files committed to main branch
- [x] Repository Settings → Pages configured
- [x] Source: Deploy from branch → main → /docs folder
- [x] Site accessible at https://chpollin.github.io/HerData/
- [x] Live demo verified and functional

Task 7.3: Final polish (COMPLETE)
- [x] Favicon (docs/favicon.svg - Navy Blue solid)
- [x] Loading spinner with "Daten werden geladen..." message
- [x] Error handling with user-facing German messages
- [x] Debug logging system (color-coded console output)
- [ ] Meta tags for social sharing (pending)

---

## Success Criteria

### Functional Requirements (Status)

- [x] Map displays all persons with geodata (1,042 women)
- [x] Marker clustering prevents visual clutter (clusterMaxZoom=10, clusterRadius=40)
- [x] Briefaktivität filter works (hat geschrieben/wurde erwähnt/nur SNDB)
- [x] Berufsgruppe filter works (7 occupation categories)
- [x] Cluster color encoding by letter activity (blue/gray/green)
- [x] Map legend (bottom-right, 3 colors with research labels)
- [x] Popup shows: name, dates, badges, stats
- [x] Multi-person popup for overlapping locations (ADR-002)
- [x] Person detail pages (6 tabs, all 3,617 women accessible)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Hover tooltips with composition breakdown
- [x] Debug logging system

### Performance Requirements (Status)

- [x] TTI ≤ 2 seconds (achieved)
- [x] Map renders smoothly (WebGL GPU acceleration)
- [x] Filter updates instant (<50ms, target was <100ms)
- [ ] Lighthouse performance score ≥ 90 (pending audit)

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Data pipeline fails | Low | High | COMPLETE - 48 tests pass, all validations successful |
| JSON too large (>10 MB) | Low | High | RESOLVED - 1.49 MB output, well under limit |
| Map performance poor | Medium | High | Use clustering, debounce filters, viewport rendering |
| Missing geodata (72%) | Low (expected) | Medium | Show in list view, clear "no location" indicator |
| Cross-browser bugs | Low | Medium | Test early, use CDN libraries |

---

## Deliverables Checklist

### Code Files
- [x] preprocessing/build_herdata.py - Data pipeline (615 lines, COMPLETE)
- [x] preprocessing/build_herdata_test.py - Test suite (550 lines, 48 tests, COMPLETE)
- [x] docs/data/persons.json - Generated dataset (1.49 MB, COMPLETE)
- [x] docs/index.html - Main page with MapLibre (107 lines, COMPLETE)
- [x] docs/css/style.css - Responsive styles with MapLibre support (600+ lines, COMPLETE)
- [x] docs/js/app.js - MapLibre map + filtering (500+ lines, COMPLETE)
- [x] docs/person.html - Person detail template (150+ lines, COMPLETE)
- [x] docs/js/person.js - Person detail page logic (487 lines, COMPLETE)
- [x] docs/favicon.svg - Brand icon (COMPLETE)

### Documentation Files
- [x] preprocessing/README.md - Pipeline and test documentation (COMPLETE)
- [x] docs/README.md - Local testing instructions (COMPLETE)
- [x] knowledge/decisions.md - ADR-001, ADR-002, ADR-003 (COMPLETE)
- [x] documentation/JOURNAL.md - Sessions 1-9 documented (~770 lines, COMPLETE)
- [x] README.md - Updated with live demo, implementation status (COMPLETE)
- [x] knowledge/design.md - UI/UX design system (COMPLETE)
- [x] knowledge/requirements.md - 14 user stories, 10 functional requirements (COMPLETE)
- [x] knowledge/data.md - Complete data model (COMPLETE)
- [x] CLAUDE.md - Coding and documentation style guidelines (COMPLETE)
- [ ] CHANGELOG.md - v0.1.0 release notes (pending)

### Deployment
- [x] GitHub Pages configured (main branch, /docs folder)
- [x] Site accessible at https://chpollin.github.io/HerData/
- [x] All 3,617 women in dataset (1,042 with geodata visible on map)
- [x] Filters functional (Briefaktivität + Berufsgruppe working)
- [x] Person detail pages accessible (person.html?id=[SNDB-ID])
- [x] Performance excellent (instant filter updates, smooth rendering)

### Testing
- [x] Data pipeline tested (48 tests, all pass, 1.73s execution)
- [x] Map rendering tested (1,042 markers, clustering, filters)
- [x] Filter system tested (Briefaktivität and Berufsgruppe working correctly)
- [x] Basic functionality verified (popups, tab switching, loading states)
- [x] Person detail pages tested (all 6 tabs, mini-map, data display)
- [x] Multi-person popup tested (overlapping locations, clickable names)
- [x] Cluster interactions tested (click, hover, zoom, color encoding)
- [ ] Cross-browser testing (Chrome/Firefox/Safari/Edge - pending)
- [ ] Mobile device testing (iOS/Android - pending)
- [ ] Lighthouse performance audit (pending)

---

## Phase 2 Preview (Week 3-4)

Next Sprint Priorities:
1. [ ] Timeline view (D3.js histogram with year-binned letter counts)
2. [ ] Network graph visualization (AGRELON relationships, co-mentions)
3. [ ] Unified search (typeahead across persons/places/letters)
4. [ ] Brushing & linking (map ↔ timeline ↔ list synchronization)
5. [ ] Full letter detail pages with regests
6. [ ] Biographical text extraction from SNDB projekt-XML
7. [ ] Story/narrative curation interface
8. [ ] CSV export functionality

Note: Person detail pages (6 tabs) completed early in Session 7

---

## Getting Started

For Day 3 (Frontend), start with:
```bash
cd docs
mkdir -p css js assets
touch index.html css/style.css js/app.js
```

Then implement HTML structure from Day 3 section above.

---

Ready to continue with Day 3 - Frontend Implementation!
