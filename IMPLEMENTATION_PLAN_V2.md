# HerData First Version Implementation Plan

Created: 2025-10-19
Status: Ready to implement
Target: Phase 1 MVP - Complete interactive visualization

## Executive Summary

This plan details the implementation of HerData version 1.0, a web-based visualization platform that makes visible the 3,617 women in Johann Wolfgang von Goethe's correspondence network (1762-1824). The implementation follows a 7-day sprint structure, building a Python data pipeline and interactive frontend with map visualization, filtering, and basic person profiles.

## Current Project Status

Documentation: 95% complete (comprehensive requirements, design system, data model)
Data availability: 100% (55.4 MB of CMIF + SNDB XML files)
Code: 5% (analysis script complete, main pipeline and frontend not started)
Deployment: 0% (GitHub Pages configured but empty)

Ready to build: Data pipeline, JSON generation, interactive map, filtering system

## Implementation Strategy

The implementation follows a two-track approach:

Track A: Data Pipeline (Days 1-2)
- Extract 3,617 women from SNDB
- Match to CMIF letters (senders and mentions)
- Enrich with geographic and biographical data
- Generate optimized JSON output

Track B: Frontend Application (Days 3-5)
- Build responsive HTML/CSS structure
- Implement Leaflet.js map with clustering
- Add filtering system (role, normierung, dates, places)
- Create person detail pages

Track C: Testing and Deployment (Days 6-7)
- Performance optimization
- Cross-browser testing
- Documentation
- GitHub Pages deployment

## Detailed 7-Day Implementation Plan

### Day 1: Data Pipeline Foundation

Goal: Extract all 3,617 women from SNDB and verify data quality

Task 1.1: Create pipeline script structure
File: preprocessing/build_herdata.py

Implementation approach:
- Use xml.etree.ElementTree for XML parsing (proven in analyze_goethe_letters.py)
- Implement 4-phase pipeline architecture
- Add comprehensive logging for debugging
- Include data quality validation at each phase

Phase 1 function: load_sndb_women()
Purpose: Identify all women in SNDB database

Data sources:
- data/SNDB/pers_koerp_main.xml (23,571 persons, IDs and names)
- data/SNDB/pers_koerp_indiv.xml (SEXUS field for gender, GND IDs)
- data/SNDB/pers_koerp_datierungen.xml (birth/death dates)

Logic:
1. Parse pers_koerp_main.xml to build ID → name mapping (27,835 entries including variants)
2. Parse pers_koerp_indiv.xml to filter SEXUS='w' (women)
3. Extract GND IDs for authority file linkage
4. Parse pers_koerp_datierungen.xml for life dates
5. Build data structure: {sndb_id: {name, fullname, gnd, birth, death, lfdnr}}

Expected output:
- 3,617 women identified
- 53.4% with GND coverage (based on SNDB statistics)
- Name variants preserved (LFDNR field indicates main vs variant)

Validation checks:
- Total count matches expected 3,617
- GND coverage approximately 53%
- No duplicate SNDB IDs
- Birth dates precede death dates where both exist

Task 1.2: Add biographical enrichment
Function: enrich_biographies()

Data sources:
- data/SNDB/pers_koerp_berufe.xml (29,375 occupation entries)
- data/SNDB/pers_koerp_orte.xml (21,058 location assignments)
- data/SNDB/pers_koerp_beziehungen.xml (6,580 relationship entries)

Logic:
1. For each woman, extract occupations with type (Beruf, Tätigkeit, Stand)
2. Extract associated places with type (Geburtsort, Sterbeort, Wirkungsort)
3. Extract relationships with AGRELON type codes
4. Store as arrays to preserve multiple entries

Task 1.3: Initial testing
- Run pipeline Phase 1
- Verify 3,617 women extracted
- Check data completeness (GND coverage, date coverage, occupation coverage)
- Generate summary statistics report

Expected completion: 6-8 hours

### Day 2: Letter Matching and Geodata Enrichment

Goal: Link women to CMIF letters and add geographic coordinates

Task 2.1: Implement letter matching
Function: match_cmif_letters()

Data source:
- data/ra-cmif.xml (15,312 letters, 23.4 MB)

Logic:
1. Parse CMIF correspDesc elements
2. Extract senders (correspAction type="sent" → persName@ref)
3. Extract mentions (correspDesc → mentionsPerson@target)
4. Match via GND-ID (primary strategy, 93.8% coverage in CMIF)
5. Fallback: name-based fuzzy matching for non-GND cases
6. Store role: "sender" | "mentioned" | "both"
7. Count letters and mentions per woman

Matching algorithm:
- Primary: GND-ID exact match (most reliable)
- Fallback 1: Exact name match (case-insensitive)
- Fallback 2: Fuzzy name match using Levenshtein distance >0.85

Expected results:
- Subset of 3,617 women will have CMIF matches (exact number to be determined)
- Role distribution: majority "mentioned", smaller subset "sender", few "both"
- Women without matches remain in dataset (visible via SNDB data only)

Task 2.2: Add geographic enrichment
Function: enrich_geodata()

Data sources:
- data/SNDB/pers_koerp_orte.xml (person → place linkage)
- data/SNDB/geo_main.xml (4,007 places)
- data/SNDB/geo_indiv.xml (coordinates, alternative names)
- data/SNDB/geo_links.xml (GeoNames IDs)

Logic:
1. For each woman, get place IDs from pers_koerp_orte.xml
2. Look up place names in geo_main.xml
3. Get coordinates from geo_indiv.xml
4. Get GeoNames IDs from geo_links.xml
5. Store as array: [{name, lat, lon, type, geonames_id}]

Expected results:
- Approximately 60% of women will have geodata (based on SNDB coverage)
- Multiple places per person (birth, death, activity locations)
- Primary place selection: Wirkungsort > Geburtsort > Sterbeort

Task 2.3: Generate JSON output
Function: build_persons_json()

Output file: docs/data/persons.json (estimated 7-10 MB)

JSON structure:
{
  "meta": {
    "generated": "ISO timestamp",
    "total_women": 3617,
    "with_letters": "count",
    "with_geodata": "count",
    "with_gnd": "count",
    "data_sources": {
      "cmif": "ra-cmif.xml (2025-03 snapshot)",
      "sndb": "SNDB export 2025-10"
    }
  },
  "persons": [
    {
      "id": "SNDB-ID",
      "name": "Display name (main form)",
      "fullname": "Full name with all parts",
      "name_variants": ["variant1", "variant2"],
      "gnd": "GND-ID or null",
      "sndb_url": "https://ores.klassik-stiftung.de/ords/f?p=900:2:::::P2_ID:{id}",
      "role": "sender | mentioned | both | indirect",
      "roles": ["sender", "mentioned"],
      "letter_count": 0,
      "mention_count": 0,
      "dates": {
        "birth": "YYYY or YYYY-MM-DD or null",
        "death": "YYYY or YYYY-MM-DD or null"
      },
      "occupations": [
        {"name": "Beruf/Tätigkeit", "type": "Beruf | Tätigkeit | Stand"}
      ],
      "places": [
        {
          "name": "Place name",
          "lat": 50.9795,
          "lon": 11.3235,
          "type": "Geburtsort | Sterbeort | Wirkungsort",
          "geonames_id": "ID or null"
        }
      ],
      "relationships": [
        {"person_id": "related SNDB-ID", "type": "AGRELON code", "label": "relationship label"}
      ],
      "normierung": "gnd | sndb | none"
    }
  ]
}

Optimization strategies:
- Remove null fields to reduce size
- Use short field names where possible
- Consider splitting into chunks if >10 MB (persons_1.json, persons_2.json, etc.)
- Generate compressed .json.gz version for production

Task 2.4: Validation and testing
- Verify JSON is valid (JSON linter)
- Check total count matches 3,617
- Verify role distribution makes sense
- Test sample queries (find person by name, filter by role, etc.)
- Generate summary statistics for documentation

Expected completion: 6-8 hours

### Day 3: Frontend HTML/CSS Structure

Goal: Build responsive layout with navigation, filters, and map container

Task 3.1: Create directory structure
Create:
- docs/index.html (main entry point)
- docs/css/style.css (main stylesheet)
- docs/css/variables.css (design tokens from design.md)
- docs/js/app.js (main application logic)
- docs/js/utils.js (helper functions)
- docs/person.html (person detail page template)
- docs/assets/ (folder for images, icons)

Task 3.2: Implement HTML structure
File: docs/index.html

Structure:
- Semantic HTML5 elements
- Global navigation with 7 areas (Entdecken, Personen, Briefe, Orte, Netzwerk, Kontext, Stories)
- Live statistics display (updated from data)
- Sidebar with filter groups
- Main content area with 3-tab view (Karte, Zeit, Netz)
- Footer with attribution and links

Accessibility features:
- ARIA labels for interactive elements
- Skip navigation link
- Semantic heading hierarchy
- Alt text for images
- Form labels for filters

Task 3.3: Implement CSS design system
File: docs/css/variables.css

Design tokens (from design.md):
- Colors: Primary palette (purple #667eea, pink #764ba2), semantic colors (success, warning, error)
- Typography: Font families, sizes (scale: 12, 14, 16, 18, 24, 32, 48px), weights
- Spacing: Scale (4, 8, 12, 16, 24, 32, 48, 64, 96px)
- Breakpoints: Mobile ≤640px, Tablet ≤1024px, Desktop >1024px
- Z-index layers: navbar (1000), sidebar (900), modal (2000)

File: docs/css/style.css

Layout:
- Flexbox for global structure (navbar + main container)
- CSS Grid for main container (sidebar + content)
- Responsive breakpoints with mobile-first approach
- Sticky navbar and sidebar
- Full-height map container

Component styles:
- Navbar: horizontal layout, brand + links + stats
- Sidebar: filter groups with checkboxes, active filters display, reset button
- Tabs: horizontal tab bar with active state
- Map container: 100% width/height of content area
- Popup: card design with badges, stats, and action button
- Person badges: colored pills for GND, SNDB, role indicators

Responsive behavior:
- Mobile (≤640px): Sidebar collapses to modal/drawer, tabs stack vertically
- Tablet (≤1024px): Sidebar narrow, map scales proportionally
- Desktop (>1024px): Full layout with sidebar + map side-by-side

Task 3.4: Create person detail page template
File: docs/person.html

Structure:
- Breadcrumb navigation (Entdecken → Personen → [Name])
- Person header (name, dates, badges)
- 6-tab content area (Überblick, Briefe, Netzwerk, Orte, Zeit, Quellen)
- Each tab as placeholder (will be populated in Phase 2)

Expected completion: 6-8 hours

### Day 4: Map Implementation with Leaflet.js

Goal: Interactive map with marker clustering and popups

Task 4.1: Initialize Leaflet map
File: docs/js/app.js

Implementation:
- Load Leaflet.js 1.9.4 from CDN
- Load Leaflet.markercluster plugin from CDN
- Initialize map centered on Weimar (50.9795, 11.3235)
- Set default zoom level 6 (shows Germany + neighboring countries)
- Add OpenStreetMap tile layer
- Configure marker cluster group (maxClusterRadius: 50, spiderfyOnMaxZoom: true)

Task 4.2: Load and parse JSON data
- Fetch docs/data/persons.json on page load
- Parse JSON into global allPersons array
- Initialize filteredPersons array (initially same as allPersons)
- Update statistics display in navbar
- Handle loading states (show spinner while fetching)
- Handle errors (network failure, invalid JSON)

Task 4.3: Render markers
Function: renderMarkers(persons)

Logic:
1. Clear existing markers from cluster group
2. Filter persons to only those with geodata (places array length > 0)
3. For each person, use primary place (prioritize Wirkungsort > Geburtsort > Sterbeort)
4. Create Leaflet marker with custom icon based on role
5. Bind popup with person information
6. Add marker to cluster group

Marker icon design:
- Color-coded by role (sender: purple, mentioned: pink, both: gold, indirect: gray)
- Size: 12x12px circular dots
- Use L.divIcon for custom styling

Task 4.4: Create popup content
Function: createPopup(person)

Popup elements:
- Name and dates (birth–death)
- Badges: GND presence, SNDB link
- Role indicators: Absenderin, Erwähnt
- Statistics: letter count, mention count
- Action button: "Details →" linking to person.html?id={sndb_id}

Styling: Card design with padding, clear typography, accessible colors

Expected completion: 4-6 hours

### Day 5: Filtering System Implementation

Goal: Interactive filters that update map and statistics in real-time

Task 5.1: Implement filter logic
File: docs/js/app.js

Filter dimensions:
1. Role filter (checkbox group)
   - Absenderin (sender)
   - Erwähnt (mentioned)
   - Indirekt (indirect, SNDB-only)

2. Normierung filter (checkbox group)
   - GND vorhanden (has GND ID)
   - Nur SNDB (SNDB ID only, no GND)
   - Keine (no authority file normierung)

3. Date range filter (slider or dual input)
   - Birth year range: 1500-1900
   - Death year range: 1500-1900
   - Filter persons whose lifespan overlaps with selected range

4. Place filter (autocomplete search)
   - Search by place name
   - Show only persons associated with selected place(s)

Function: applyFilters()

Logic:
1. Get selected values from all filter groups
2. Filter allPersons array by all criteria (AND logic within group, OR logic between groups)
3. Update filteredPersons array
4. Call renderMarkers(filteredPersons) to update map
5. Update statistics display (current count / total count)
6. Update active filters display
7. Animate transition (fade out old markers, fade in new markers)

Task 5.2: Add filter UI enhancements
- Active filters display: show pills for each active filter with × to remove
- Reset all button: clear all filters and restore to initial state
- Filter count badges: show count of results for each filter option
- Disable unavailable filters: gray out filters that would result in 0 results

Task 5.3: Implement search functionality
- Text input with autocomplete
- Search by person name (fuzzy match)
- Results dropdown with highlighting
- Click result to zoom map to person's location and open popup
- Keyboard navigation support (arrow keys, enter, escape)

Task 5.4: Add URL state management
- Encode filter state in URL query parameters
- Allow bookmarking and sharing of filtered views
- Example: ?role=sender,mentioned&normierung=gnd&place=Weimar
- Parse URL on page load and apply filters

Expected completion: 8-10 hours

### Day 6: Testing, Optimization, and Polish

Goal: Ensure performance targets met and cross-browser compatibility

Task 6.1: Performance optimization
Target metrics:
- Time to Interactive (TTI) ≤ 2 seconds
- Map render time ≤ 1 second
- Filter update time ≤ 100ms

Optimization strategies:
- JSON minification (remove whitespace)
- Gzip compression for persons.json
- Lazy-load map tiles
- Debounce filter updates (wait 150ms after last checkbox change)
- Use requestAnimationFrame for smooth marker updates
- Consider web workers for filtering if dataset is large
- Implement virtual scrolling for person list view (if added)

Measurement:
- Use Lighthouse performance audit
- Chrome DevTools Performance panel
- Test on throttled network (Fast 3G simulation)
- Test on low-end device (CPU 4x slowdown)

Task 6.2: Cross-browser testing
Browsers to test:
- Chrome (desktop + Android)
- Firefox (desktop)
- Safari (desktop + iOS)
- Edge (desktop)

Test checklist for each browser:
- Map renders correctly
- Markers appear at correct locations
- Clustering works
- Popups display properly
- Filters update map
- Search autocomplete works
- Responsive layout at all breakpoints
- No console errors

Known issues to watch for:
- Safari may have issues with ES6 module syntax (use polyfills if needed)
- IE11 not supported (show upgrade message if detected)

Task 6.3: Accessibility audit
WCAG 2.1 AA compliance:

Perceivable:
- Color contrast ≥4.5:1 for normal text, ≥3:1 for large text
- Alt text for all images
- Text remains readable at 200% zoom
- No information conveyed by color alone

Operable:
- All functionality available via keyboard
- Tab order logical
- Focus indicators visible
- No keyboard traps
- Skip navigation link present

Understandable:
- Form labels clear
- Error messages helpful
- Language attribute set (lang="de")
- Consistent navigation

Robust:
- Valid HTML (W3C validator)
- ARIA attributes used correctly
- Screen reader testing (NVDA on Windows, VoiceOver on Mac)

Task 6.4: Mobile responsiveness testing
Devices to test:
- iPhone SE (small screen 375px)
- iPhone 12 Pro (medium screen 390px)
- iPad (tablet 768px)
- Samsung Galaxy S20 (Android 360px)

Test scenarios:
- Map zooming and panning with touch
- Sidebar drawer opens and closes
- Filter checkboxes are tappable (min 44px touch target)
- Popups display correctly on small screens
- No horizontal scrolling
- Text remains legible at default zoom

Task 6.5: Add polish and loading states
- Loading spinner while fetching JSON
- Skeleton screens for map and sidebar
- Error state if data fails to load
- Empty state if filters return 0 results
- Favicon (use logo or simple "H" icon)
- Meta tags for social sharing (Open Graph, Twitter Cards)
- Page title updates based on active filters

Expected completion: 6-8 hours

### Day 7: Documentation and Deployment

Goal: Deploy to GitHub Pages and finalize documentation

Task 7.1: Update project documentation

File: README.md
Updates:
- Add deployment URL
- Add screenshots of map view
- Add usage instructions
- Update installation steps
- Add browser compatibility information

File: JOURNAL.md
Add entry:
- Date: 2025-10-[date]
- Session: Phase 1 MVP Implementation Complete
- Key activities: Data pipeline, frontend, deployment
- Statistics: 3,617 women, [X] with geodata, [X] with letters
- Deployment URL: https://[username].github.io/HerData/

Create: CHANGELOG.md
Version 0.1.0 - 2025-10-[date]

Added:
- Data pipeline extracting 3,617 women from SNDB
- CMIF letter matching with GND and name-based strategies
- Geographic enrichment with coordinates
- Interactive Leaflet.js map with marker clustering
- Filtering by role, normierung, dates, and places
- Person search with autocomplete
- Person popups with basic information
- Responsive design for mobile, tablet, desktop
- GitHub Pages deployment

Known limitations:
- Person detail pages are placeholders (Phase 2)
- Timeline view not implemented (Phase 2)
- Network graph not implemented (Phase 3)
- Biographical narratives not included (Phase 3)

Task 7.2: GitHub Pages deployment

Steps:
1. Ensure all files are committed to main branch
2. Go to repository Settings → Pages
3. Set Source: Deploy from branch
4. Select branch: main
5. Select folder: /docs
6. Save
7. Wait 2-5 minutes for deployment
8. Verify site is accessible at https://[username].github.io/HerData/

Configuration:
- Add custom domain (optional): herdata.klassik-stiftung.de or similar
- Enforce HTTPS (recommended)
- Set up GitHub Actions for automated deployment (optional)

Task 7.3: Create user help documentation

File: docs/help.html

Content:
- How to use filters
- How to navigate the map
- How to interpret person popups
- How to search for persons
- FAQ section
- Contact information for feedback
- Link to GitHub repository

Task 7.4: Optional analytics setup
- Google Analytics or Plausible (privacy-focused)
- Track: page views, filter usage, popular persons, search queries
- Respect Do Not Track browser setting
- Add privacy policy if using analytics

Task 7.5: Final commit and announcement
- Create git tag v0.1.0
- Push to GitHub
- Create release on GitHub with changelog
- Share deployment URL with stakeholders
- Announce on project channels (if applicable)

Expected completion: 4-6 hours

## Technical Architecture

### Data Pipeline Architecture

Input sources:
- CMIF XML (15,312 letters)
- SNDB XML (14 files, 23,571 persons)

Processing phases:
1. Identify Women: Parse SNDB → filter SEXUS='w' → 3,617 women
2. Match Letters: Parse CMIF → GND matching → assign roles
3. Enrich Data: Add geodata, occupations, relationships, dates
4. Generate JSON: Merge all data → optimize → output

Output:
- docs/data/persons.json (7-10 MB)
- Optional: docs/data/persons_sample.json (100 persons for testing)

### Frontend Architecture

Technology stack:
- HTML5 (semantic elements)
- CSS3 (Grid, Flexbox, custom properties)
- JavaScript ES6+ (modules, async/await, fetch API)
- Leaflet.js 1.9.4 (map visualization)
- Leaflet.markercluster (marker clustering)

Module structure:
- app.js (main application controller)
- map.js (map initialization and marker rendering)
- filters.js (filter logic and UI updates)
- search.js (person search and autocomplete)
- utils.js (helper functions, data transformations)

Data flow:
1. Load persons.json on page load
2. Store in global state (allPersons, filteredPersons)
3. User interacts with filters → applyFilters() → update filteredPersons
4. Call renderMarkers(filteredPersons) → update map
5. User clicks marker → show popup
6. User clicks "Details" → navigate to person.html?id={sndb_id}

### Performance Optimization Strategy

Target metrics:
- Time to Interactive (TTI): ≤ 2 seconds
- First Contentful Paint (FCP): ≤ 1 second
- Largest Contentful Paint (LCP): ≤ 2.5 seconds
- Total Blocking Time (TBT): ≤ 300ms

Optimization techniques:
- Minimize JSON size (remove nulls, short field names)
- Gzip compression for static files
- Lazy-load map tiles
- Debounce filter updates
- Use marker clustering to reduce DOM elements
- Minimize JavaScript bundle size (no large frameworks)
- Use CDN for libraries (caching)
- Preconnect to external domains
- Add resource hints (preload, prefetch)

### Responsive Design Strategy

Breakpoints:
- Mobile: ≤640px (single column, sidebar drawer, stacked tabs)
- Tablet: 641-1024px (narrow sidebar, map scales proportionally)
- Desktop: >1024px (full layout, sidebar + map side-by-side)

Layout adjustments:
- Mobile: Sidebar becomes bottom sheet or drawer (hamburger menu)
- Mobile: Tabs become dropdown or swipeable carousel
- Tablet: Sidebar width reduced to 200px (vs 300px on desktop)
- Desktop: Full feature set, optimal information density

Touch optimization:
- Minimum touch target size: 44x44px
- Increase spacing between interactive elements
- Use larger checkboxes and buttons on mobile
- Add touch gestures for map (pinch to zoom, swipe to pan)

## Success Criteria

### Functional Requirements (Must Have)

FR-01: Map displays all persons with geodata (estimated 60% of 3,617)
FR-02: Marker clustering prevents visual clutter (max 50px radius)
FR-03: Role filter includes: sender, mentioned, indirect
FR-04: Normierung filter includes: gnd, sndb, none
FR-05: Person popup displays: name, dates, badges, stats, action button
FR-06: Search autocomplete finds persons by name (fuzzy match)
FR-07: Filters update map in real-time (<100ms)
FR-08: URL state reflects active filters (bookmarkable)
FR-09: Responsive design works on mobile, tablet, desktop
FR-10: Person detail page shows basic information (placeholders for Phase 2)

### Performance Requirements (Must Have)

NFR-01: Time to Interactive ≤ 2 seconds (on fast 3G)
NFR-02: Map render time ≤ 1 second (with 2,000+ markers)
NFR-03: Filter update time ≤ 100ms (perceived as instant)
NFR-04: Page size ≤ 10 MB total (including JSON data)
NFR-05: Lighthouse performance score ≥ 90

### Accessibility Requirements (Must Have)

ACC-01: WCAG 2.1 AA compliance (color contrast, keyboard navigation)
ACC-02: Screen reader compatible (ARIA labels, semantic HTML)
ACC-03: Keyboard accessible (tab navigation, focus indicators)
ACC-04: Text resizable to 200% without loss of functionality
ACC-05: No reliance on color alone for information

### Usability Requirements (Should Have)

UX-01: Filter count badges show result counts
UX-02: Active filters display with remove buttons
UX-03: Empty state message when filters return 0 results
UX-04: Loading states for data fetching
UX-05: Error handling with helpful messages

## Risk Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Data pipeline fails to extract 3,617 women | Low | High | Test with sample (100 women) first; validate each phase; comprehensive error logging |
| JSON file exceeds 10 MB (GitHub Pages limit) | Medium | High | Implement chunking (split into multiple files); use gzip compression; remove unnecessary fields |
| Map performance poor with 2,000+ markers | Medium | High | Increase cluster radius; reduce marker detail; implement viewport-based rendering |
| Missing geodata for 40% of women | Low (expected) | Medium | Show in list view; clear "no location" indicator; allow filtering to hide |
| Cross-browser compatibility issues | Low | Medium | Test early and often; use CDN libraries (well-tested); polyfills for older browsers |
| CMIF letter matching fails (GND mismatch) | Medium | Medium | Implement fallback name-based matching; log unmatched cases; manual review if needed |
| Mobile performance poor | Medium | Medium | Test on real devices; optimize for mobile first; reduce JavaScript execution |
| Accessibility compliance gaps | Low | Medium | Use automated testing tools (axe, WAVE); manual screen reader testing; iterative fixes |

## Out of Scope for Version 1.0

The following features are explicitly excluded from Phase 1 MVP and deferred to Phase 2 or Phase 3:

Phase 2 (Week 3-4):
- Timeline view with D3.js histogram
- Complete person detail pages (6 tabs)
- Letter detail pages with regest
- Brushing and linking between views
- Person list view with export (CSV/JSON)
- Biographical narratives from projekt-XML files

Phase 3 (Week 5-6):
- Network graph with D3.js force-directed layout
- AGRELON relationship filtering (44 types)
- Place profiles with person aggregations
- Stories module (curated biographical narratives)
- Advanced search (full-text, faceted)
- API endpoints for external integration

Not planned:
- User accounts or authentication
- Collaborative annotation features
- Data editing or contribution
- Real-time data updates
- Export to other formats (PDF, RDF)
- Integration with external authority files (beyond GND, GeoNames)

## Deliverables Checklist

### Code Files
- [ ] preprocessing/build_herdata.py (4-phase data pipeline)
- [ ] docs/data/persons.json (3,617 women, 7-10 MB)
- [ ] docs/index.html (main page with map)
- [ ] docs/person.html (person detail template)
- [ ] docs/css/variables.css (design tokens)
- [ ] docs/css/style.css (main stylesheet)
- [ ] docs/js/app.js (main application logic)
- [ ] docs/js/map.js (map initialization and rendering)
- [ ] docs/js/filters.js (filter logic)
- [ ] docs/js/search.js (person search)
- [ ] docs/js/utils.js (helper functions)
- [ ] docs/help.html (user documentation)
- [ ] docs/assets/favicon.ico (site icon)

### Documentation Files
- [ ] README.md (updated with deployment URL and screenshots)
- [ ] JOURNAL.md (Phase 1 completion entry)
- [ ] CHANGELOG.md (v0.1.0 release notes)
- [ ] docs/help.html (user guide)

### Deployment
- [ ] GitHub Pages configured (main branch, /docs folder)
- [ ] Site accessible at https://[username].github.io/HerData/
- [ ] All 3,617 women visible
- [ ] Map functional with clustering
- [ ] Filters working (role, normierung)
- [ ] Search working
- [ ] Performance targets met (TTI ≤ 2s)
- [ ] Mobile responsive
- [ ] Accessibility compliant (WCAG AA)

### Testing
- [ ] Data pipeline tested and validated
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing complete (iOS, Android)
- [ ] Accessibility audit complete (automated + manual)
- [ ] Performance audit complete (Lighthouse score ≥ 90)
- [ ] User testing with sample users (optional)

## Estimated Effort

| Activity | Estimated Hours | Complexity |
|----------|----------------|------------|
| Day 1: Data pipeline foundation | 6-8 | Medium |
| Day 2: Letter matching and geodata | 6-8 | Medium-High |
| Day 3: Frontend HTML/CSS | 6-8 | Low-Medium |
| Day 4: Map implementation | 4-6 | Medium |
| Day 5: Filtering system | 8-10 | Medium-High |
| Day 6: Testing and optimization | 6-8 | Medium |
| Day 7: Documentation and deployment | 4-6 | Low |
| Total | 40-54 hours | - |

Recommended schedule:
- Full-time (8 hours/day): 5-7 days
- Part-time (4 hours/day): 10-14 days
- Weekend project (16 hours/weekend): 3-4 weekends

## Getting Started Right Now

Step 1: Verify prerequisites
- Python 3.x installed
- Data files present in data/ folder (55.4 MB)
- Git repository initialized
- Text editor or IDE ready

Step 2: Create pipeline script
```bash
cd preprocessing
# Windows
type nul > build_herdata.py
# Mac/Linux
touch build_herdata.py
```

Step 3: Implement Phase 1 function
```python
import xml.etree.ElementTree as ET
from pathlib import Path

def load_sndb_women():
    """Phase 1: Identify women from SNDB"""
    data_dir = Path('../data/SNDB')

    # Load main person data
    main_tree = ET.parse(data_dir / 'pers_koerp_main.xml')
    main_root = main_tree.getroot()

    # Load individual data with SEXUS field
    indiv_tree = ET.parse(data_dir / 'pers_koerp_indiv.xml')
    indiv_root = indiv_tree.getroot()

    # Filter for SEXUS='w'
    women = {}
    # Implementation here...

    return women

if __name__ == '__main__':
    women = load_sndb_women()
    print(f"Found {len(women)} women")
```

Step 4: Test
```bash
python build_herdata.py
# Expected: "Found 3617 women"
```

## Next Steps After Version 1.0

After successful deployment of Phase 1 MVP, the project will proceed to:

Phase 2 Implementation (Week 3-4):
- Timeline view showing letter distribution over time
- Complete person detail pages with 6 tabs
- Letter detail pages with regest and TEI links
- Brushing and linking between map, timeline, and list views
- CSV/JSON export functionality

Phase 3 Implementation (Week 5-6):
- Network graph visualization with AGRELON relationships
- Place profiles aggregating person data
- Stories module with curated biographical narratives
- Advanced search and filtering
- API documentation and endpoints

Long-term Roadmap:
- User feedback collection and iterative improvements
- Additional data sources integration
- Collaborative annotation features (if needed)
- Educational modules and lesson plans
- Publication and dissemination (conference presentations, articles)

## Questions and Clarifications

Before starting implementation, clarify:

1. Data pipeline:
   - Should we implement a simplified version (100 women) first for testing?
   - Should the pipeline be idempotent (can be run multiple times safely)?
   - Should we generate intermediate output files for debugging?

2. Frontend:
   - Do you want to start with the data pipeline or frontend first?
   - Should we use a JavaScript framework (Vue, React) or vanilla JS?
   - Should we implement progressive enhancement (works without JS)?

3. Design:
   - Are there existing brand colors or logos to use?
   - Should we create a custom map style or use default OpenStreetMap?
   - Do you have accessibility requirements beyond WCAG AA?

4. Deployment:
   - What should the GitHub Pages URL be (username.github.io/HerData or custom domain)?
   - Should we set up automated deployment (GitHub Actions)?
   - Do you want staging and production environments?

5. Testing:
   - Do you want automated tests (unit tests, integration tests)?
   - Should we implement CI/CD (continuous integration/deployment)?
   - Do you have specific user scenarios to test?

## Conclusion

This implementation plan provides a comprehensive roadmap for building HerData version 1.0, an interactive web-based visualization platform that makes visible the 3,617 women in Goethe's correspondence network. The plan follows a 7-day sprint structure, balancing data pipeline development, frontend implementation, testing, and deployment.

The project is in an excellent state to begin implementation, with comprehensive documentation, verified data sources, and clear success criteria. All prerequisites are met, and the technical approach is well-defined.

Ready to start building!
