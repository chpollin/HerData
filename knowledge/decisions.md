# Architecture Decision Records (ADR)

This document tracks significant technical decisions made during HerData development. Each decision includes context, alternatives considered, and rationale.

Format: Decision number, date, status (proposed/accepted/rejected/superseded)

---

## ADR-001: Map Library Selection (2025-10-19)

Status: Under consideration

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

### Status

Decision pending: Awaiting final approval before implementation.

Alternative: Create small proof-of-concept with both libraries to compare developer experience and visual output before committing.

---

## Future Decisions

Placeholder for additional architecture decisions:

- ADR-002: Network visualization library (D3.js vs Force-Graph vs Cytoscape.js)
- ADR-003: Timeline implementation approach (D3.js custom vs Chart.js vs Observable Plot)
- ADR-004: State management strategy (Vanilla JS vs Zustand vs Redux)
- ADR-005: Routing strategy for person profiles (Hash-based vs History API)
