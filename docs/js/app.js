// HerData - MapLibre GL JS Implementation
// Interactive map visualization with filtering

let map;
let allPersons = [];
let filteredPersons = [];

// Tooltip variables (accessible to all event handlers)
let clusterTooltip = null;
let markerTooltip = null;

// Compact logging utility
const log = {
    init: (msg) => console.log(`🟢 INIT: ${msg}`),
    render: (msg) => console.log(`🔵 RENDER: ${msg}`),
    event: (msg) => console.log(`🟡 EVENT: ${msg}`),
    click: (msg) => console.log(`🟠 CLICK: ${msg}`),
    error: (msg) => console.error(`🔴 ERROR: ${msg}`)
};

// Role colors matching design.md
const ROLE_COLORS = {
    'sender': '#2c5f8d',      // Steel Blue - Absenderin
    'mentioned': '#6c757d',   // Medium Gray - Erwähnt
    'both': '#2d6a4f',        // Forest Green - Beide
    'indirect': '#adb5bd'     // Light Gray - Indirekt
};

// Initialize application
async function init() {
    log.init('Starting application');
    try {
        await loadData();
        initMap();
        initFilters();
        initTabs();
        log.init('Application ready');
    } catch (error) {
        showError('Initialisierung fehlgeschlagen: ' + error.message);
        log.error('Init failed: ' + error.message);
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

    log.init(`Loaded ${allPersons.length} persons, ${data.meta.with_geodata} with geodata`);
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

    // Check if source exists - update data or create new source
    if (map.getSource('persons')) {
        // Update existing source data (preserves layers and event handlers)
        log.render(`Updating data: ${geojson.features.length} markers (via setData)`);
        map.getSource('persons').setData(geojson);
    } else {
        // First time: create source with clustering
        log.render(`Creating source: ${geojson.features.length} markers (initial)`);
        map.addSource('persons', {
            type: 'geojson',
            data: geojson,
            cluster: true,
            clusterMaxZoom: 10,
            clusterRadius: 40
        });
    }

    // Only add layers if they don't exist yet
    if (!map.getLayer('persons-clusters')) {
        log.render('Adding layers and event handlers (first time)');
        addMapLayers();
        setupEventHandlers();
    }
}

// Add map layers (called only once)
function addMapLayers() {
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
}

// Setup event handlers for map interactions (called only once)
function setupEventHandlers() {
    log.event('Registering event handlers');

    // Click handler for individual markers
    map.on('click', 'persons-layer', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['persons-layer']
        });
        log.click(`Marker: ${features.length} person(s) at location`);

        if (features.length === 1) {
            showSinglePersonPopup(e.lngLat, features[0].properties);
        } else {
            showMultiPersonPopup(e.lngLat, features);
        }
    });

    // Click handler for clusters
    map.on('click', 'persons-clusters', (e) => {
        log.click('Cluster clicked - processing...');

        // Remove hover tooltip first
        if (clusterTooltip) {
            clusterTooltip.remove();
            clusterTooltip = null;
        }

        const features = map.queryRenderedFeatures(e.point, {
            layers: ['persons-clusters']
        });

        if (!features || features.length === 0) {
            log.error('No cluster features found at click point');
            return;
        }

        const clusterId = features[0].properties.cluster_id;
        const pointCount = features[0].properties.point_count;
        log.click(`Cluster: ${pointCount} persons (id: ${clusterId})`);

        // For small clusters (≤50), show popup directly
        if (pointCount <= 50) {
            log.click(`Getting leaves for cluster (≤50 threshold)`);
            map.getSource('persons').getClusterLeaves(clusterId, pointCount, 0, (err, clusterFeatures) => {
                if (err) {
                    log.error('getClusterLeaves failed: ' + err);
                    return;
                }
                log.click(`Showing popup with ${clusterFeatures.length} persons`);
                showMultiPersonPopup(e.lngLat, clusterFeatures);
            });
        } else {
            log.click(`Zooming to expansion level (>50 threshold)`);
            map.getSource('persons').getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) {
                    log.error('getClusterExpansionZoom failed: ' + err);
                    return;
                }
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            });
        }
    });

    // Hover tooltips for clusters
    map.on('mouseenter', 'persons-clusters', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        const pointCount = e.features[0].properties.point_count;
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Create tooltip content
        const html = `<div class="hover-tooltip">${pointCount} Frauen</div>`;

        clusterTooltip = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'hover-tooltip-popup'
        })
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(map);
    });

    map.on('mouseleave', 'persons-clusters', () => {
        map.getCanvas().style.cursor = '';
        if (clusterTooltip) {
            clusterTooltip.remove();
            clusterTooltip = null;
        }
    });

    // Hover tooltips for individual markers
    map.on('mouseenter', 'persons-layer', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        const props = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Create tooltip content
        const dates = props.birth || props.death
            ? `(${props.birth || '?'}–${props.death || '?'})`
            : '';
        const html = `<div class="hover-tooltip"><strong>${props.name}</strong> ${dates}</div>`;

        markerTooltip = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'hover-tooltip-popup'
        })
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(map);
    });

    map.on('mouseleave', 'persons-layer', () => {
        map.getCanvas().style.cursor = '';
        if (markerTooltip) {
            markerTooltip.remove();
            markerTooltip = null;
        }
    });
}

// Show popup for single person
function showSinglePersonPopup(lngLat, properties) {
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

// Show popup for multiple people at same location
function showMultiPersonPopup(lngLat, features) {
    const count = features.length;
    const firstFeature = features[0].properties;
    const locationName = firstFeature.place_name;
    const locationType = firstFeature.place_type;

    // Build list of persons (show first 15, with option to expand)
    const maxInitial = 15;
    const showAll = count <= maxInitial;
    const personsToShow = showAll ? features : features.slice(0, maxInitial);

    let personItems = personsToShow.map(feature => {
        const p = feature.properties;
        const dates = p.birth || p.death ? `(${p.birth || '?'} – ${p.death || '?'})` : '';
        const gndBadge = p.gnd ? '<span class="badge badge-gnd">GND</span>' : '';

        const stats = [];
        if (p.letter_count > 0) stats.push(`${p.letter_count} Briefe`);
        if (p.mention_count > 0) stats.push(`${p.mention_count} Erw.`);
        const statsText = stats.length > 0 ? stats.join(' • ') : '';

        return `
            <div class="person-item" data-id="${p.id}" onclick="window.location.href='person.html?id=${p.id}'">
                <div class="person-name">
                    <strong>${p.name}</strong> ${dates}
                </div>
                <div class="person-meta">
                    ${gndBadge}
                    <span class="badge badge-sndb">SNDB</span>
                    ${statsText ? `<span class="person-stats">${statsText}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');

    const showMoreButton = !showAll
        ? `<button class="show-more-btn" onclick="expandPersonList(event)">Zeige alle ${count} Frauen</button>`
        : '';

    const html = `
        <div class="multi-person-popup">
            <h3>${locationName}</h3>
            <p class="location-info">${count} Frauen • ${locationType}</p>
            <div class="person-list">
                ${personItems}
            </div>
            ${showMoreButton}
        </div>
    `;

    new maplibregl.Popup({
        maxWidth: '400px'
    })
        .setLngLat(lngLat)
        .setHTML(html)
        .addTo(map);

    // Store all features for potential expansion
    map._currentPopupFeatures = features;
}

// Expand person list to show all entries
window.expandPersonList = function(event) {
    event.preventDefault();
    const features = map._currentPopupFeatures;
    if (!features) return;

    const firstFeature = features[0].properties;

    // Rebuild popup with all persons
    let personItems = features.map(feature => {
        const p = feature.properties;
        const dates = p.birth || p.death ? `(${p.birth || '?'} – ${p.death || '?'})` : '';
        const gndBadge = p.gnd ? '<span class="badge badge-gnd">GND</span>' : '';

        const stats = [];
        if (p.letter_count > 0) stats.push(`${p.letter_count} Briefe`);
        if (p.mention_count > 0) stats.push(`${p.mention_count} Erw.`);
        const statsText = stats.length > 0 ? stats.join(' • ') : '';

        return `
            <div class="person-item" data-id="${p.id}" onclick="window.location.href='person.html?id=${p.id}'">
                <div class="person-name">
                    <strong>${p.name}</strong> ${dates}
                </div>
                <div class="person-meta">
                    ${gndBadge}
                    <span class="badge badge-sndb">SNDB</span>
                    ${statsText ? `<span class="person-stats">${statsText}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');

    // Update popup content
    const popupContent = event.target.closest('.maplibregl-popup-content');
    if (popupContent) {
        const personList = popupContent.querySelector('.person-list');
        const showMoreBtn = popupContent.querySelector('.show-more-btn');

        if (personList) personList.innerHTML = personItems;
        if (showMoreBtn) showMoreBtn.remove();
    }
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

    log.render(`Filters applied: ${filteredPersons.length} / ${allPersons.length} persons`);

    // Update map
    if (map && map.loaded()) {
        renderMarkers(filteredPersons);
    }
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
