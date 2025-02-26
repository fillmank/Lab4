// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZmlsbG1hbmsiLCJhIjoiY203YzgyZ2V0MG1scjJrcHY3aW8wMGE2cyJ9.97L0-l7omtxjppq1qtuvKg';

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/fillmank/cm7jnr0ut00l201so6bs585u7', // Your Mapbox style
    projection: 'albers', // Projection
    zoom: 3, // Initial zoom level
    center: [-98.79539, 40.07263] // Initial center coordinates
});


// Load GeoJSON data and add it as a layer
map.on('load', () => {
    // Fetch GeoJSON data
    fetch('/data/fuel.geojson')
        .then(response => response.json())
        .then(data => {
            // Add the GeoJSON source to the map
            map.addSource('fuel', {
                type: 'geojson',
                data: data
            });

            // Add a layer for the GeoJSON data
            map.addLayer({
                id: 'fuel-layer',
                type: 'fill',
                source: 'fuel',
                paint: {
                    'fill-color': '#ff5733', // Default fill color
                    'fill-opacity': 0.6,
                    'fill-outline-color': '#ffffff' // White border
                }
            });

            // Add hover effect
            let hoveredFeatureId = null;

            map.on('mousemove', 'fuel-layer', (e) => {
                if (e.features.length > 0) {
                    // Change the cursor to a pointer
                    map.getCanvas().style.cursor = 'pointer';

                    // Highlight the hovered feature
                    if (hoveredFeatureId !== null) {
                        map.setFeatureState(
                            { source: 'fuel', id: hoveredFeatureId },
                            { hover: false }
                        );
                    }

                    hoveredFeatureId = e.features[0].id;
                    map.setFeatureState(
                        { source: 'fuel', id: hoveredFeatureId },
                        { hover: true }
                    );

                    // Change the fill color on hover
                    map.setPaintProperty('fuel-layer', 'fill-color', [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        '#ffff00', // Highlight color (yellow)
                        '#ff5733' // Default color
                    ]);
                }
            });

            // Reset the cursor and feature state when the mouse leaves the layer
            map.on('mouseleave', 'fuel-layer', () => {
                if (hoveredFeatureId !== null) {
                    map.setFeatureState(
                        { source: 'fuel', id: hoveredFeatureId },
                        { hover: false }
                    );
                }
                hoveredFeatureId = null;
                map.getCanvas().style.cursor = '';
                map.setPaintProperty('fuel-layer', 'fill-color', '#ff5733'); // Reset to default color
            });

            // Add popup on click
            map.on('click', 'fuel-layer', (e) => {
                const feature = e.features[0];
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`
                        <strong>Location:</strong> ${feature.properties.location}<br>
                        <strong>Fuel Type:</strong> ${feature.properties.fuel_type}
                    `)
                    .addTo(map);
            });
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });
});