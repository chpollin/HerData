// HerData - MapLibre GL JS Implementation
// Interactive map visualization with filtering

let map;
let allPersons = [];
let filteredPersons = [];

// Role colors matching design.md
const ROLE_COLORS = {
    'sender': '#2c5f8d',      // Steel Blue - Absenderin
    'mentioned': '#6c757d',   // Medium Gray - Erwähnt
    'both': '#2d6a4f',        // Forest Green - Beide
    'indirect': '#adb5bd'     // Light Gray - Indirekt
};

// Initialize application
async function init() {
    try {
        await loadData();
        initMap();
        initFilters();
        initTabs();
    } catch (error) {
        showError('Initialisierung fehlgeschlagen: ' + error.message);
        console.error('Init error:', error);
    }
}

// Load persons.json data
async function loadData() {
    const loading = document.getElementById('loading');
    loading.textContent = 'Daten werden geladen...';

    const response = await fetch('data/persons.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // Validate structure
    if (!data.meta || !Array.isArray(data.persons)) {
        throw new Error('Ungültige Datenstruktur');
    }

    allPersons = data.persons;
    filteredPersons = allPersons;

    // Update stats in navbar
    updateStats(data.meta);

    loading.textContent = `${data.meta.total_women} Frauen geladen`;
    loading.style.background = '#d8f3dc';
    loading.style.color = '#2d6a4f';

    console.log(`Loaded ${allPersons.length} persons, ${data.meta.with_geodata} with geodata`);
}

// Initialize MapLibre map
function initMap() {
    map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
            sources: {
                'osm-tiles': {
                    type: 'raster',
                    tiles: [
                        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    ],
                    tileSize: 256,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
            },
            layers: [
                {
                    id: 'osm-tiles-layer',
                    type: 'raster',
                    source: 'osm-tiles',
                    minzoom: 0,
                    maxzoom: 19
                }
            ]
        },
        center: [11.3235, 50.9795], // Weimar
        zoom: 5
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Wait for map to load, then add markers
    map.on('load', () => {
        renderMarkers(filteredPersons);
        hideLoading();
    });
}

// Convert persons to GeoJSON format
function personsToGeoJSON(persons) {
    const features = [];

    persons.forEach(person => {
        if (!person.places || person.places.length === 0) return;

        // Use first place (primary location)
        const place = person.places[0];

        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [place.lon, place.lat]
            },
            properties: {
                id: person.id,
                name: person.name,
                role: person.role,
                normierung: person.normierung,
                gnd: person.gnd || null,
                birth: person.dates?.birth || null,
                death: person.dates?.death || null,
                letter_count: person.letter_count || 0,
                mention_count: person.mention_count || 0,
                place_name: place.name,
                place_type: place.type
            }
        });
    });

    return {
        type: 'FeatureCollection',
        features: features
    };
}

// Render markers on map
function renderMarkers(persons) {
    const geojson = personsToGeoJSON(persons);

    // Remove existing layers and sources
    if (map.getLayer('persons-layer')) {
        map.removeLayer('persons-layer');
    }
    if (map.getLayer('persons-clusters')) {
        map.removeLayer('persons-clusters');
    }
    if (map.getLayer('persons-cluster-count')) {
        map.removeLayer('persons-cluster-count');
    }
    if (map.getSource('persons')) {
        map.removeSource('persons');
    }

    // Add GeoJSON source with clustering
    map.addSource('persons', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 10,  // Clusters break apart at zoom 10 (was 14)
        clusterRadius: 40    // Smaller radius for less aggressive clustering (was 50)
    });

    // Cluster circles
    map.addLayer({
        id: 'persons-clusters',
        type: 'circle',
        source: 'persons',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': '#2c5f8d',
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,  // radius for count < 10
                10, 20,  // radius for count 10-50
                50, 25,  // radius for count 50-100
                100, 30  // radius for count >= 100
            ],
            'circle-opacity': 0.7,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Cluster count labels
    map.addLayer({
        id: 'persons-cluster-count',
        type: 'symbol',
        source: 'persons',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Noto Sans Regular'],
            'text-size': 12
        },
        paint: {
            'text-color': '#ffffff'
        }
    });

    // Individual person markers
    map.addLayer({
        id: 'persons-layer',
        type: 'circle',
        source: 'persons',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': [
                'match',
                ['get', 'role'],
                'sender', ROLE_COLORS.sender,
                'mentioned', ROLE_COLORS.mentioned,
                'both', ROLE_COLORS.both,
                'indirect', ROLE_COLORS.indirect,
                ROLE_COLORS.indirect
            ],
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5, 6,    // radius at zoom 5 (was 4)
                10, 10,  // radius at zoom 10 (was 8)
                15, 16   // radius at zoom 15 (was 12)
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.8
        }
    });

    // Add click handler for individual markers
    map.on('click', 'persons-layer', (e) => {
        const properties = e.features[0].properties;
        showPopup(e.lngLat, properties);
    });

    // Add click handler for clusters
    map.on('click', 'persons-clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['persons-clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('persons').getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        });
    });

    // Change cursor on hover
    map.on('mouseenter', 'persons-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'persons-layer', () => {
        map.getCanvas().style.cursor = '';
    });
    map.on('mouseenter', 'persons-clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'persons-clusters', () => {
        map.getCanvas().style.cursor = '';
    });

    console.log(`Rendered ${geojson.features.length} markers`);
}

// Show popup for person
function showPopup(lngLat, properties) {
    const dates = properties.birth || properties.death
        ? `(${properties.birth || '?'} – ${properties.death || '?'})`
        : '';

    const gndBadge = properties.gnd
        ? '<span class="badge badge-gnd">GND</span>'
        : '';

    const stats = [];
    if (properties.letter_count > 0) {
        stats.push(`<strong>${properties.letter_count}</strong> Briefe`);
    }
    if (properties.mention_count > 0) {
        stats.push(`<strong>${properties.mention_count}</strong> Erwähnungen`);
    }

    const html = `
        <div class="popup">
            <h3>${properties.name} ${dates}</h3>
            <div class="popup-badges">
                ${gndBadge}
                <span class="badge badge-sndb">SNDB</span>
            </div>
            <div class="popup-stats">
                ${stats.length > 0 ? '<p>' + stats.join(' • ') + '</p>' : ''}
                <p class="popup-location">${properties.place_name} (${properties.place_type})</p>
            </div>
            <a href="person.html?id=${properties.id}">Details →</a>
        </div>
    `;

    new maplibregl.Popup()
        .setLngLat(lngLat)
        .setHTML(html)
        .addTo(map);
}

// Initialize filter system
function initFilters() {
    const roleCheckboxes = document.querySelectorAll('input[name="role"]');
    const normierungCheckboxes = document.querySelectorAll('input[name="normierung"]');
    const resetButton = document.getElementById('reset-filters');

    // Attach change listeners
    roleCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
    normierungCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

    // Reset button
    resetButton.addEventListener('click', () => {
        roleCheckboxes.forEach(cb => cb.checked = true);
        normierungCheckboxes.forEach(cb => cb.checked = true);
        applyFilters();
    });
}

// Apply filters to data and update map
function applyFilters() {
    const roleFilters = getCheckedValues('role');
    const normierungFilters = getCheckedValues('normierung');

    // Filter persons
    filteredPersons = allPersons.filter(person => {
        // Role filter: check if person's role matches any selected role
        const roleMatch = roleFilters.some(r => {
            if (person.roles && person.roles.includes(r)) return true;
            if (person.role === r) return true;
            return false;
        });

        // Normierung filter
        const normierungMatch = normierungFilters.includes(person.normierung);

        return roleMatch && normierungMatch;
    });

    // Update map
    if (map && map.loaded()) {
        renderMarkers(filteredPersons);
    }

    console.log(`Filtered: ${filteredPersons.length} / ${allPersons.length} persons`);
}

// Get checked checkbox values
function getCheckedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// Initialize tab switching
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-view`) {
                    content.classList.add('active');
                }
            });

            // Resize map if switching to map tab
            if (targetTab === 'map' && map) {
                setTimeout(() => map.resize(), 100);
            }
        });
    });
}

// Update statistics in navbar
function updateStats(meta) {
    document.getElementById('stat-letters').textContent = '15.312 Briefe';
    document.getElementById('stat-women').textContent = `${meta.total_women.toLocaleString('de-DE')} Frauen`;
    document.getElementById('stat-places').textContent = '633 Orte';
}

// Hide loading message
function hideLoading() {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.style.display = 'none';
    }, 500);
}

// Show error message
function showError(message) {
    const loading = document.getElementById('loading');
    loading.textContent = message;
    loading.style.background = '#f8d7da';
    loading.style.color = '#9b2226';
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
