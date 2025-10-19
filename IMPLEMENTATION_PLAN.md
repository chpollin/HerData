# HerData Implementation Plan

Created: 2025-10-19
Updated: 2025-10-19 (Session 3 - Testing Complete)
Status: Day 1-2 COMPLETE - Data pipeline and tests implemented
Target: Phase 1 MVP (Week 1-2)

**Note**: See [IMPLEMENTATION_PLAN_V2.md](IMPLEMENTATION_PLAN_V2.md) for comprehensive expanded plan with detailed architecture, risk mitigation, and complete technical specifications.

---

## Implementation Progress

### Week 1: Data Pipeline + Testing

**Day 1-2: Data Pipeline - COMPLETE**
- File: [preprocessing/build_herdata.py](preprocessing/build_herdata.py)
- 4-phase architecture implemented: identify women, match letters, enrich data, generate JSON
- Results: 3,617 women extracted, 808 matched to CMIF (192 senders, 772 mentioned)
- Geodata: 1,042 women with coordinates (28.8%)
- Output: [docs/data/persons.json](docs/data/persons.json) (1.49 MB)
- Execution time: 1.39 seconds
- All inline validations pass

**Testing Suite - COMPLETE**
- File: [preprocessing/build_herdata_test.py](preprocessing/build_herdata_test.py)
- 48 tests across 10 categories: execution, phases 1-4, examples, statistics, performance, edge cases, completeness
- All tests pass successfully
- Test execution: 1.73 seconds
- Documentation: [preprocessing/README.md](preprocessing/README.md)

**Day 3-5: Frontend - PENDING**
- HTML/CSS structure with responsive layout
- Leaflet.js map with marker clustering
- Filtering system (role, normierung, dates, places)
- Person detail pages

**Day 6-7: Testing and Deployment - PENDING**
- Performance optimization
- Cross-browser testing
- GitHub Pages deployment

---

## Prerequisites 

Data Files Available:
-  `data/ra-cmif.xml` (24 MB, 15,312 letters)
-  `data/SNDB/*.xml` (14 files, 32 MB, 23,571 persons)

Documentation Complete:
-  [requirements.md](knowledge/requirements.md) - 14 user stories, 10 functional requirements
-  [design.md](knowledge/design.md) - UI/UX specification
-  [data.md](knowledge/data.md) - Complete data model
-  [wireframe.md](knowledge/wireframe.md) - Technical UI spec

Tools Required:
-  Python 3.x (for data pipeline)
-  Git/GitHub (repository ready)
-  Text editor/IDE

---

## Phase 1: MVP Implementation (Week 1-2)

Goal: Interactive map showing 3,617 women with basic filtering

Success Criteria:
- Map loads in <2s
- 3,617 women visible (list view)
- Subset with geodata shown as map markers
- 2 filters functional (Role, Normierung)
- Deployed to GitHub Pages

---

## Week 1: Data Pipeline + Basic Frontend

### Day 1: Data Pipeline Script (Build Foundation)

Task 1.1: Create pipeline script structure
```bash
File: preprocessing/build_herdata.py
```

Functions to implement:
```python
# Phase 1: Identify women (SEXUS=w)
def load_sndb_women():
    """Load all women from pers_koerp_indiv.xml where SEXUS=w"""
    # Parse pers_koerp_main.xml for ID, Name
    # Parse pers_koerp_indiv.xml for SEXUS, GND
    # Filter SEXUS=w → 3,617 women
    # Return: {id: {name, gnd, sndb_id}}

# Phase 2: Match CMIF letters
def match_cmif_letters(women):
    """Match letters from ra-cmif.xml to women"""
    # Parse CMIF persName@ref (senders)
    # Parse CMIF mentionsPerson@target (mentions)
    # Match via GND-ID (primary) or name (fallback)
    # Return: {woman_id: {as_sender: [letters], as_mentioned: [letters]}}

# Phase 3: Enrich with geodata
def enrich_geodata(women):
    """Add coordinates from SNDB geo files"""
    # Parse pers_koerp_orte.xml (person → place)
    # Parse geo_main.xml (place ID → name)
    # Parse geo_indiv.xml (place → lat/lon)
    # Return: {woman_id: {places: [{name, lat, lon, type}]}}

# Phase 4: Build JSON output
def build_persons_json(women, letters, geodata):
    """Generate docs/data/persons.json"""
    # Merge all data sources
    # Calculate: letter_count, mention_count
    # Determine role: "sender" | "mentioned" | "both"
    # Determine normierung: "gnd" | "sndb" | "none"
    # Output format (see below)
```

Output JSON Structure:
```json
{
  "meta": {
    "generated": "2025-10-19T12:00:00Z",
    "total_women": 3617,
    "with_geodata": 2156,
    "data_sources": ["CMIF 2025-03", "SNDB 2025-10"]
  },
  "persons": [
    {
      "id": "43779",
      "name": "Vulpius, Christiane",
      "fullname": "Johanna Christiana Sophia Vulpius",
      "gnd": "118627856",
      "sndb_url": "https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:43779",
      "role": "both",
      "roles": ["sender", "mentioned"],
      "letter_count": 215,
      "mention_count": 659,
      "dates": {
        "birth": "1765",
        "death": "1816"
      },
      "places": [
        {
          "name": "Weimar",
          "lat": 50.9795,
          "lon": 11.3235,
          "type": "Wirkungsort"
        }
      ],
      "normierung": "gnd"
    }
  ]
}
```

Testing:
```bash
cd preprocessing
python build_herdata.py
# Expected output: docs/data/persons.json (~7 MB)
```



---

### Day 2: Validate & Optimize Pipeline

Task 2.1: Data Quality Checks
- Verify 3,617 women extracted
- Count women with geodata (expect ~60%)
- Check GND coverage (expect ~53%)
- Validate role distribution (senders vs. mentioned)

Task 2.2: Optimize JSON Size
- Remove unnecessary fields
- Compress repeated strings
- Consider gzipping for GitHub Pages

Task 2.3: Generate Test Subset
```bash
File: docs/data/persons_sample.json (first 100 women for testing)
```



---

### Day 3: Frontend Skeleton

Task 3.1: Create HTML structure
```bash
File: docs/index.html
```

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HerData - Frauen in Goethes Briefkorrespondenz</title>

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <!-- Leaflet MarkerCluster CSS -->
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
                <label><input type="checkbox" name="normierung" value="none" checked> Keine</label>
            </div>

            <!-- Active Filters Display -->
            <div id="active-filters"></div>
            <button id="reset-filters">Alle zurücksetzen</button>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Tab Navigation -->
            <div class="tabs">
                <button class="tab active" data-tab="map">Karte</button>
                <button class="tab" data-tab="timeline">Zeit</button>
                <button class="tab" data-tab="network">Netz</button>
            </div>

            <!-- Map View -->
            <div id="map-view" class="tab-content active">
                <div id="map"></div>
            </div>

            <!-- Timeline View (Phase 2) -->
            <div id="timeline-view" class="tab-content" style="display:none;">
                <p>Timeline wird in Phase 2 implementiert</p>
            </div>

            <!-- Network View (Phase 3) -->
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

Task 3.2: Create CSS
```bash
File: docs/css/style.css
```

Key styles:
- Responsive layout (sidebar + map)
- Color scheme (from design.md)
- Mobile breakpoints



---

### Day 4-5: Map Implementation

Task 4.1: Initialize Leaflet map
```bash
File: docs/js/app.js
```

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
    const map = L.map('map').setView([50.9795, 11.3235], 6); // Center on Weimar

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create marker cluster group
    const markers = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false
    });

    // Add markers
    renderMarkers(markers, filteredPersons);
    map.addLayer(markers);
}

// Render markers
function renderMarkers(clusterGroup, persons) {
    clusterGroup.clearLayers();

    persons.forEach(person => {
        if (!person.places || person.places.length === 0) return;

        const place = person.places[0]; // Use primary place
        const marker = L.marker([place.lat, place.lon], {
            icon: getMarkerIcon(person.role)
        });

        // Popup
        marker.bindPopup(createPopup(person));

        clusterGroup.addLayer(marker);
    });
}

// Marker icon by role
function getMarkerIcon(role) {
    const colors = {
        'sender': '#667eea',
        'mentioned': '#764ba2',
        'both': '#ffd700'
    };

    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${colors[role] || '#999'}"></div>`,
        iconSize: [12, 12]
    });
}

// Create popup content
function createPopup(person) {
    const dates = person.dates
        ? `(${person.dates.birth || '?'} – ${person.dates.death || '?'})`
        : '';

    const badges = [];
    if (person.gnd) badges.push('<span class="badge badge-gnd">GND</span>');
    badges.push('<span class="badge badge-sndb">SNDB</span>');

    const roleBadges = person.roles.map(r =>
        `<span class="badge badge-role">${r === 'sender' ? 'Absenderin' : 'Erwähnt'}</span>`
    ).join(' ');

    return `
        <div class="popup">
            <h3>${person.name} ${dates}</h3>
            <div class="popup-badges">${badges.join(' ')}</div>
            <div class="popup-roles">${roleBadges}</div>
            <div class="popup-stats">
                ${person.letter_count ? `<p><strong>${person.letter_count}</strong> Briefe</p>` : ''}
                ${person.mention_count ? `<p><strong>${person.mention_count}</strong> Erwähnungen</p>` : ''}
            </div>
            <a href="person.html?id=${person.id}" class="btn-details">Details →</a>
        </div>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', loadData);
```

Task 4.2: Implement filtering
```javascript
// Filter logic
function applyFilters() {
    const roleFilters = getCheckedValues('role');
    const normierungFilters = getCheckedValues('normierung');

    filteredPersons = allPersons.filter(person => {
        // Role filter
        const roleMatch = roleFilters.some(r =>
            person.roles.includes(r)
        );

        // Normierung filter
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

## Week 2: Polish + Deploy

### Day 6: Testing & Optimization

Task 6.1: Performance testing
- Test with full dataset (3,617 persons)
- Measure TTI (target: <2s)
- Optimize marker rendering if needed
- Test on mobile devices

Task 6.2: Cross-browser testing
- Chrome, Firefox, Safari, Edge
- iOS Safari, Android Chrome
- Fix any compatibility issues

Task 6.3: Accessibility audit
- Keyboard navigation
- Screen reader testing
- WCAG AA contrast checks



---

### Day 7: Documentation & Deployment

Task 7.1: Create user documentation
```bash
File: docs/help.html (optional)
```

Task 7.2: GitHub Pages setup
```bash
# In repository settings:
# Settings → Pages → Source: main branch, /docs folder
# Custom domain (optional)
```

Task 7.3: Add analytics (optional)
- Google Analytics or Plausible
- Track: page views, filter usage, popular persons

Task 7.4: Final polish
- Favicon
- Meta tags for social sharing
- Loading states / skeleton screens
- Error handling (data load fails)



---

## Deliverables Checklist

### Code
- [ ] `preprocessing/build_herdata.py` - Data pipeline
- [ ] `docs/data/persons.json` - Generated dataset (~7 MB)
- [ ] `docs/index.html` - Main HTML structure
- [ ] `docs/css/style.css` - Responsive styles
- [ ] `docs/js/app.js` - Map logic + filtering
- [ ] `docs/person.html` - Placeholder for person detail (Phase 2)

### Documentation
- [ ] Update README.md with deployment URL
- [ ] Update JOURNAL.md with Phase 1 completion
- [ ] Create CHANGELOG.md (v0.1.0 - MVP)

### Deployment
- [ ] GitHub Pages configured
- [ ] Site accessible at https://[username].github.io/HerData/
- [ ] All 3,617 women visible in list/map
- [ ] Filters functional
- [ ] Performance <2s TTI

---

## Phase 1 Success Metrics

Functional:
-  Map displays with clustering
-  3,617 women loaded (subset with geodata on map)
-  Role filter works (sender/mentioned/both)
-  Normierung filter works (gnd/sndb/none)
-  Popup shows: name, dates, role badges, stats
-  Click "Details →" navigates to placeholder page

Performance:
-  TTI (Time to Interactive) ≤ 2s
-  Map renders smoothly (≥30 FPS)
-  Filter updates instant (<100ms)

Usability:
-  Mobile responsive (3 breakpoints)
-  Keyboard navigable
-  WCAG AA contrast

---

## Phase 2 Preview (Week 3-4)

Next Sprint:
1. Timeline view (D3.js histogram)
2. Person detail pages (6 tabs)
3. Unified search (typeahead)
4. Brushing & linking (map ↔ timeline ↔ list)

Data requirements for Phase 2:
- `docs/data/letters.json` - All 15,312 letters
- `docs/data/biographies.json` - Extracted from projekt-XML

---

## Risk Mitigation

| Risk | Mitigation Plan |
|------|----------------|
| Data pipeline fails | Test with sample (100 women) first; validate each phase |
| JSON too large (>10 MB) | Implement lazy-loading; split into chunks |
| Map performance poor | Reduce marker detail; increase cluster radius; virtualization |
| Missing geodata (40%) | Show in list view; clear "no location" indicator |
| Cross-browser bugs | Test early; use CDN libraries (well-tested) |

---

## Daily Standup Questions

Before starting each day:
1. What did I complete yesterday?
2. What will I work on today?
3. Any blockers?

Example Day 1:
- Yesterday: Created implementation plan
- Today: Build data pipeline Phase 1 (identify women)
- Blockers: None

---

## Getting Started (Right Now!)

Step 1: Create pipeline script
```bash
cd preprocessing
touch build_herdata.py
```

Step 2: Implement Phase 1 function
```python
import xml.etree.ElementTree as ET

def load_sndb_women():
    """Phase 1: Identify women from SNDB"""
    # Start here!
    pass

if __name__ == '__main__':
    women = load_sndb_women()
    print(f"Found {len(women)} women")
```

Step 3: Test
```bash
python build_herdata.py
# Expected: "Found 3617 women"
```

---

## Questions Before Starting?

- Do you want to start with the data pipeline or frontend first?
- Should we implement a simplified version (e.g., 100 women) before scaling?
- Any specific libraries/tools you prefer?
- Do you want to pair-program or review each component?

---

Ready to start? Let's build Phase 1! 🚀
