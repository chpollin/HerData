# Architecture Decision Records (ADR)

This document tracks significant technical decisions made during HerData development. Each decision includes context, alternatives considered, and rationale.

Format: Decision number, date, status (proposed/accepted/rejected/superseded)

---

## ADR-001: Map Library Selection (2025-10-19)

Status: Accepted - MapLibre GL JS chosen for MVP implementation

### Context

HerData requires an interactive map to visualize 1,042 women with geodata across three implementation phases:

Phase 1 (MVP):
- Basic marker clustering
- Popups with person information
- Filter synchronization (role, normierung)

Phase 2 (Enhancement):
- Brushing and linking between map, timeline, and network views
- Optional heatmap/density visualization
- Temporal animation with Zeit-Slider
- Dynamic marker sizing based on letter count

Phase 3 (Advanced):
- Potential dual-layer visualization (network overlay on map)
- Edge-fading animations for temporal network projection
- Mini-maps embedded in person profiles

Constraints:
- Static site deployment (GitHub Pages)
- No backend server
- No API key dependencies preferred
- Open-source requirement
- Academic/research context
- Target performance: TTI ≤ 2s

### Alternatives Considered

#### Option A: Leaflet.js

Advantages:
- Lightweight (40 KB gzipped)
- Extensive digital humanities adoption (British National Archives, UT Austin, ANU)
- Simple API with abundant documentation
- Large plugin ecosystem
- Proven in similar historical mapping projects
- Wider browser compatibility (no WebGL requirement)

Disadvantages:
- Canvas/SVG rendering (not WebGL)
- Limited animation capabilities
- Heatmaps require plugin (Leaflet.heat)
- Brushing and linking requires custom coordination logic
- Dynamic styling less flexible
- Cluster transitions not smooth

Technical details:
- Rendering: HTML/CSS/Canvas
- Tile support: Raster (PNG/JPG)
- Bundle size: ~40 KB
- Browser support: All modern + older browsers

#### Option B: MapLibre GL JS

Advantages:
- WebGL-accelerated rendering (smooth animations)
- Native vector tile support with dynamic styling
- Built-in heatmap functionality
- Better performance for synchronized views
- Modern, professional appearance
- Growing academic adoption (University of Rennes 2, Ben-Gurion University)
- Fully open-source (community fork of Mapbox GL JS)
- No API keys required

Disadvantages:
- Larger bundle (220 KB gzipped, 5.5x vs Leaflet)
- Steeper learning curve
- Requires WebGL-capable browsers
- Less established in digital humanities community
- More complex API

Technical details:
- Rendering: WebGL
- Tile support: Vector (MVT) + Raster
- Bundle size: ~220 KB
- Browser support: Modern browsers with WebGL

#### Option C: OpenLayers

Considered but rejected due to:
- Even larger bundle size (>300 KB)
- More complex API than both alternatives
- Overkill for project requirements
- Less common in digital humanities

#### Option D: Mapbox GL JS

Rejected due to:
- Requires API key and billing setup
- Not suitable for open academic project
- MapLibre is open-source alternative

### Decision Criteria

1. Phase 2/3 feasibility: Brushing, linking, animations
2. Bundle size impact on GitHub Pages performance
3. Open-source licensing and sustainability
4. Learning curve and development velocity
5. Academic context appropriateness
6. Community support and documentation

### Analysis

Critical requirement analysis:
- design.md line 55 specifies "Leaflet/WebGL" suggesting WebGL consideration
- US-02 requires brush-selection filtering between timeline and map
- FR-02 specifies marker size based on data (letter count)
- design.md mentions optional heatmap layer
- Phase 2 temporal animation with Zeit-Slider
- Phase 3 potential network overlay visualization

Leaflet limitations for Phase 2+:
- Timeline-to-map synchronization requires custom event coordination
- Animated marker transitions not native (requires plugins like Leaflet.markercluster)
- Heatmap requires additional plugin dependency
- Dynamic marker sizing based on data less elegant
- Performance degradation with frequent filter updates

MapLibre advantages for Phase 2+:
- Native expression-based styling (data-driven marker sizes/colors)
- Smooth transitions built-in
- Heatmap layer native
- Better performance for real-time filtering
- WebGL rendering handles animation efficiently

Bundle size consideration:
- Current data: persons.json = 1.49 MB
- Leaflet: +40 KB (2.7% increase)
- MapLibre: +220 KB (14.8% increase)
- Both acceptable for GitHub Pages (10 MB limit)
- Modern browsers handle 220 KB easily with HTTP/2 compression

### Recommendation

Use MapLibre GL JS for the following reasons:

1. Phase 2 requirements (brushing, linking, animations) are significantly easier with WebGL rendering
2. Built-in heatmap aligns with design.md specification
3. Data-driven styling more elegant for dynamic marker sizing
4. 220 KB bundle size acceptable given 1.5 MB data payload
5. More professional appearance suitable for academic showcase
6. Future-proof for Phase 3 advanced visualizations
7. Open-source with no API key dependencies

Trade-offs accepted:
- Larger bundle size (220 KB vs 40 KB)
- Steeper initial learning curve
- Less established in DH community (mitigated by growing academic adoption)

### Implementation Notes

If MapLibre is chosen:
- Use CDN for initial MVP: https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js
- Consider bundling for production to enable offline development
- Plan for graceful degradation message for non-WebGL browsers
- Document examples from University of Rennes 2 and Ben-Gurion as references

If Leaflet is chosen instead:
- Accept Phase 2 animation limitations
- Plan for Leaflet.heat plugin integration
- Budget extra time for custom brushing/linking coordination logic
- Consider migration to MapLibre for Phase 3 if needed

### References

- MapLibre GL JS documentation: https://maplibre.org/maplibre-gl-js/docs/
- Leaflet documentation: https://leafletjs.com/
- University of Rennes 2 MapLibre examples: https://sites-formations.univ-rennes2.fr/mastersigat/MaplibreGL/
- Ben-Gurion University Web Mapping course: https://geobgu.xyz/web-mapping-2022/maplibre.html
- Bundle size comparison: https://bundlephobia.com/

### Final Decision

MapLibre GL JS has been selected and implemented for the MVP.

Rationale for immediate adoption:
- WebGL rendering provides superior performance for 1,042 markers with clustering
- Data-driven styling enables elegant role-based coloring without custom icons
- Native clustering support with smooth zoom transitions
- Better foundation for Phase 2 brushing and linking requirements
- 220 KB bundle size acceptable given project scope
- Implementation completed successfully with clean API

Implementation details (2025-10-19):
- CDN version: maplibre-gl@4.7.1
- Base map: OpenStreetMap raster tiles
- Clustering: enabled with clusterMaxZoom=14, clusterRadius=50
- Role-based colors: Steel Blue (sender), Medium Gray (mentioned), Forest Green (both), Light Gray (indirect)
- Interactive features: click to zoom on clusters, popups on individual markers, hover cursor changes
- Filter integration: real-time map updates when role/normierung filters change
- Tab switching: map resize handled automatically

Performance achieved:
- Map loads and renders 1,042 markers smoothly
- Filter updates instant with layer re-rendering
- Popup display responsive
- No performance degradation observed

Trade-offs accepted:
- Larger bundle than Leaflet (220 KB vs 40 KB) - accepted as negligible given 1.5 MB data payload
- WebGL requirement - acceptable for target audience (modern browsers)
- Steeper learning curve - mitigated by clear documentation and examples

---

## ADR-002: Overlapping Marker Strategy (2025-10-19)

Status: Accepted - Multi-person popup with location grouping

### Context

HerData displays 1,042 women with geodata on an interactive map. A critical usability issue emerged: multiple women often share identical coordinates (e.g., "Weimar (Wirkungsort)"), causing markers to stack on top of each other. Users can only click the topmost marker, making other women at the same location inaccessible.

Problem characteristics:
- Geographic concentration: Weimar (34%), Jena (15%), Berlin (7%)
- Many women share city-level coordinates (no street addresses)
- Historical data often has imprecise location information
- Clustering helps at lower zoom levels but not when fully zoomed in

Project requirement (requirements.md FR-02):
- "Leaflet.js mit Clustering (Spiderfier bei Overlap)"
- Risk mitigation: "Geographic concentration (Weimar 34%)" → "Spider-Cluster, Zoom-Decluttering"

### Alternatives Considered

#### Option A: Spiderfy Plugin

Use third-party spiderfy library to "explode" overlapping markers into a circle/spiral pattern.

Available plugins:
- @nazka/map-gl-js-spiderfy: Canvas-based spiderfication with circle/spiral patterns
- maplibre-spiderfier (ohrie): DOM-based overlay markers with spider legs
- Custom implementation: Native solution using icon-offset property

Advantages:
- Visual pattern familiar from Leaflet.MarkerCluster
- Each person gets individual clickable marker
- Clear visual indication of multiple entries at location
- Aligns with original requirements.md specification

Disadvantages:
- Additional dependency (10-20 KB)
- Requires configuration and integration testing
- Spiderfy pattern can be visually cluttered with many markers
- Doesn't work well on mobile (small touch targets)
- Extra clicks required (click to spiderfy, then click individual marker)

#### Option B: Multi-Person Popup

Group all persons at the same coordinates and show them together in a single popup with scrollable list.

Implementation:
- Detect click coordinates
- Query all features at that location (queryRenderedFeatures)
- Build popup with list of all persons
- Include name, dates, role badges, stats for each
- Scrollable if more than 5-6 entries

Advantages:
- No additional dependencies (pure MapLibre)
- Better UX: single click reveals all people at location
- Works well on mobile (no tiny touch targets)
- Supports "discovery" use case: users see all women at a location
- Cleaner visual appearance (no spider legs)
- Aligns with design.md principle: "Overview → Zoom/Filter → Details on Demand"

Disadvantages:
- Requires custom popup template design
- Scrolling needed for locations with many women
- Less visual indication that multiple markers exist at location

#### Option C: Coordinate Jittering

Add small random offset (0.0001-0.0005 degrees) to markers with identical coordinates.

Advantages:
- Simple implementation
- No dependencies
- Markers always individually clickable

Disadvantages:
- Geographically inaccurate (introduces false precision)
- Unprofessional for academic/scholarly context
- Violates data integrity principles
- Random offset inconsistent across sessions

#### Option D: Increase Clustering at High Zoom

Keep clustering active at zoom 15+ with very small clusterRadius for exact-coordinate matches only.

Advantages:
- Uses existing clustering infrastructure
- Familiar interaction pattern

Disadvantages:
- Confusing UX: "Why is there still a cluster when I'm fully zoomed in?"
- Requires additional zoom action to expand
- Doesn't solve the core problem (still need to handle unclustered overlaps)

### Decision Criteria

1. User experience: Minimize clicks to access all women
2. Mobile-friendliness: Touch-friendly interaction
3. Academic context: Professional, accurate representation
4. Implementation complexity: Minimize dependencies and maintenance
5. Discovery support: Help users find all women at a location
6. Design alignment: Match design.md principles

### Analysis

Critical requirements from design.md:
- Line 11: "Overview first → zoom & filter → details on demand" (Shneiderman)
- Line 19: "Person finden & verstehen" (top user task)
- Line 59: "Performance-Ziel: ≤ 2 s TTI bei initialem View"
- Line 109: "progressive Offenlegung, Chunking"

Requirements.md specification:
- FR-02: "Spiderfier bei Overlap" suggests visual expansion
- Risk table: "Spider-Cluster, Zoom-Decluttering"

However, deeper analysis reveals:
- Target audience: "kultur-interessierte Laien" (design.md line 15)
- Primary task: "Räume erkunden" (explore geographic distribution)
- Historical data has limited precision (city-level coordinates)
- Mobile usage expected for public-facing platform

Spiderfy limitations for this context:
- Adds visual complexity (spider legs, animation)
- Requires two interactions (spiderfy trigger, then marker click)
- Small touch targets on mobile when spiderfied
- Plugin dependency increases maintenance burden

Multi-person popup advantages for this context:
- Single interaction (one click → see all)
- Better discovery: users see all women at location immediately
- Clean visual design (no additional markers/lines)
- Works well on mobile (scrollable list)
- No dependencies (pure MapLibre API)
- Aligns with "Overview → Details" pattern

### Recommendation

Implement Option B: Multi-person popup with location grouping

Rationale:
1. Better UX for target audience (general public, students)
2. Supports primary task (geographic exploration and discovery)
3. Mobile-friendly (no small touch targets)
4. Clean implementation (no external dependencies)
5. Professional appearance for academic context
6. Easier maintenance (no plugin updates)

Trade-offs accepted:
- Deviates from original "Spiderfier" specification in requirements.md
- Requires custom popup template design
- Less visual indication before click that multiple markers exist

Mitigation for trade-off:
- Consider adding cluster count badge to overlapping markers in future iteration
- Document this decision clearly in ADR
- Can be enhanced later with spiderfy if user testing shows need

### Implementation Notes

Implementation approach:
1. Modify click handler to query all features at clicked point
2. Group features by exact coordinates
3. Build multi-person popup template with list
4. Add scrolling for locations with 5+ persons
5. Include mini-badges (role, GND status) for each person
6. Link each person to detail page (Phase 2)

Popup template structure:
```html
<div class="multi-person-popup">
  <h3>Weimar (Wirkungsort)</h3>
  <p class="location-count">12 Frauen an diesem Ort</p>
  <ul class="person-list">
    <li>
      <strong>Name</strong> (dates)
      <span class="badges">GND SNDB</span>
      <span class="stats">5 Briefe</span>
    </li>
    <!-- ... -->
  </ul>
</div>
```

Performance consideration:
- Limit displayed persons to first 20 (add "Show more" button)
- Keep popup rendering fast

### References

- MapLibre queryRenderedFeatures: https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#queryrenderedfeatures
- Spiderfy plugins: @nazka/map-gl-js-spiderfy, maplibre-spiderfier
- Design principles: knowledge/design.md lines 11, 109
- Requirements: knowledge/requirements.md FR-02

### Future Considerations

If user testing reveals issues with multi-person popup approach:
- Consider hybrid: multi-person popup + spiderfy toggle button
- Add visual indicator (badge) showing marker count before click
- Implement zoom-to-spread functionality for dense clusters

---

## Future Decisions

Placeholder for additional architecture decisions:

- ADR-003: Network visualization library (D3.js vs Force-Graph vs Cytoscape.js)
- ADR-004: Timeline implementation approach (D3.js custom vs Chart.js vs Observable Plot)
- ADR-005: State management strategy (Vanilla JS vs Zustand vs Redux)
- ADR-006: Routing strategy for person profiles (Hash-based vs History API)
