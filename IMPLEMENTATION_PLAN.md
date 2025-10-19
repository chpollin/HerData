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

### Pending (Days 3-7)

**Day 3-5: Frontend - PENDING**
- HTML/CSS structure with responsive layout
- Leaflet.js map with marker clustering
- Filtering system (role, normierung, dates, places)
- Person detail pages

**Day 6-7: Testing and Deployment - PENDING**
- Performance optimization (target: TTI ≤ 2s)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Accessibility audit (WCAG AA compliance)
- GitHub Pages deployment

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

### Day 3: Frontend HTML/CSS Structure (PENDING)

Goal: Build responsive layout with navigation, filters, and map container

Task 3.1: Create directory structure
- docs/index.html (main entry point)
- docs/css/style.css (main stylesheet)
- docs/css/variables.css (design tokens from design.md)
- docs/js/app.js (main application logic)
- docs/person.html (person detail page template)

Task 3.2: Implement HTML structure
Structure:
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

Task 3.3: Implement CSS design system
Design tokens (from design.md):
- Colors: Primary palette (purple #667eea, pink #764ba2)
- Typography: Font sizes (12, 14, 16, 18, 24, 32, 48px)
- Spacing: Scale (4, 8, 12, 16, 24, 32, 48, 64, 96px)
- Breakpoints: Mobile ≤640px, Tablet ≤1024px, Desktop >1024px

Responsive behavior:
- Mobile (≤640px): Sidebar collapses to drawer, tabs stack vertically
- Tablet (≤1024px): Sidebar narrow, map scales proportionally
- Desktop (>1024px): Full layout with sidebar + map side-by-side

---

### Day 4: Map Implementation with Leaflet.js (PENDING)

Goal: Interactive map with marker clustering and popups

Task 4.1: Initialize Leaflet map
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

Task 4.2: Render markers
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

Task 4.3: Create popup content
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

### Day 5: Filtering System Implementation (PENDING)

Goal: Interactive filters that update map in real-time

Filter dimensions:
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

### Day 6: Testing and Optimization (PENDING)

Task 6.1: Performance optimization
Target metrics:
- Time to Interactive (TTI) ≤ 2 seconds
- Map render time ≤ 1 second
- Filter update time ≤ 100ms

Optimization strategies:
- JSON minification (already optimized: 1.49 MB)
- Gzip compression for persons.json
- Debounce filter updates (150ms)
- Use requestAnimationFrame for smooth marker updates

Task 6.2: Cross-browser testing
Browsers: Chrome, Firefox, Safari, Edge
Test: Map rendering, markers, clustering, popups, filters

Task 6.3: Accessibility audit
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader testing (NVDA, VoiceOver)
- Color contrast ≥4.5:1

Task 6.4: Mobile responsiveness
Devices: iPhone SE, iPhone 12, iPad, Samsung Galaxy S20
Test: Touch gestures, sidebar drawer, filter tappability

---

### Day 7: Documentation and Deployment (PENDING)

Task 7.1: Update documentation
- README.md: Add deployment URL, screenshots, usage instructions
- JOURNAL.md: Add Phase 1 completion entry
- Create CHANGELOG.md (v0.1.0)

Task 7.2: GitHub Pages deployment
Steps:
1. Ensure all files committed to main branch
2. Repository Settings → Pages
3. Source: Deploy from branch → main → /docs folder
4. Wait 2-5 minutes for deployment
5. Verify site accessible at https://[username].github.io/HerData/

Task 7.3: Final polish
- Favicon
- Meta tags for social sharing
- Loading spinner
- Error handling

---

## Success Criteria

### Functional Requirements
- Map displays all persons with geodata (1,042 women)
- Marker clustering prevents visual clutter
- Role filter works (sender/mentioned/indirect)
- Normierung filter works (gnd/sndb)
- Popup shows: name, dates, badges, stats
- Responsive design (mobile, tablet, desktop)

### Performance Requirements
- TTI ≤ 2 seconds
- Map renders smoothly (≥30 FPS)
- Filter updates instant (<100ms)
- Lighthouse performance score ≥ 90

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Screen reader compatible
- Keyboard accessible
- No reliance on color alone

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
- [x] preprocessing/build_herdata.py - Data pipeline (COMPLETE)
- [x] preprocessing/build_herdata_test.py - Test suite (COMPLETE)
- [x] docs/data/persons.json - Generated dataset (COMPLETE)
- [ ] docs/index.html - Main page with map
- [ ] docs/css/style.css - Responsive styles
- [ ] docs/js/app.js - Map logic + filtering
- [ ] docs/person.html - Person detail template

### Documentation Files
- [x] preprocessing/README.md - Pipeline documentation (COMPLETE)
- [ ] README.md - Update with deployment URL
- [ ] JOURNAL.md - Phase 1 completion entry
- [ ] CHANGELOG.md - v0.1.0 release notes

### Deployment
- [ ] GitHub Pages configured
- [ ] Site accessible at https://[username].github.io/HerData/
- [ ] All 3,617 women visible
- [ ] Filters functional
- [ ] Performance <2s TTI

### Testing
- [x] Data pipeline tested (48 tests, all pass)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility audit
- [ ] Performance audit

---

## Phase 2 Preview (Week 3-4)

Next Sprint:
1. Timeline view (D3.js histogram)
2. Person detail pages (6 tabs)
3. Unified search (typeahead)
4. Brushing & linking (map ↔ timeline ↔ list)

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
