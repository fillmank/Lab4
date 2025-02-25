// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZmlsbG1hbmsiLCJhIjoiY203YzgyZ2V0MG1scjJrcHY3aW8wMGE2cyJ9.97L0-l7omtxjppq1qtuvKg';

// Initialize the Mapbox map
const map = new mapboxgl.Map({
    container: 'map', // 
    style: 'mapbox://styles/fillmank/cm7jnr0ut00l201so6bs585u7',
    projection: 'albers',  // Uses Albers projection
    zoom: 2,
    center: [-98.79539, 40.07263]
});


// Load GeoJSON data and add it as an interactive layer
fetch('/data/fuel.geojson')
    .then(response => response.json())
    .then(data => {
        map.addSource('fuel-data', {
            type: 'geojson',
            data: data
        });

        // Add the data layer with interactivity
        map.addLayer({
            id: 'fuel-layer',
            type: 'fill',
            source: 'fuel-data',
            paint: {
                'fill-color': '#ff5733',  // Default fill color
                'fill-opacity': 0.6,
                'fill-outline-color': '#ffffff' // White border for visibility
            }
        });

        // Add hover effect: Change fill color when hovering
        map.addLayer({
            id: 'fuel-highlight',
            type: 'fill',
            source: 'fuel-data',
            paint: {
                'fill-color': '#ffff00', // Highlight color (yellow)
                'fill-opacity': 0.8
            },
            filter: ['==', 'id', ''] // Empty filter (no feature selected initially)
        });

        // Change cursor to pointer when hovering over features
        map.on('mouseenter', 'fuel-layer', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'fuel-layer', () => {
            map.getCanvas().style.cursor = '';
        });

        // Highlight feature on hover
        map.on('mousemove', 'fuel-layer', (e) => {
            if (e.features.length > 0) {
                map.setFilter('fuel-highlight', ['==', 'id', e.features[0].id]);
            }
        });

        // Reset highlight when the mouse leaves
        map.on('mouseleave', 'fuel-layer', () => {
            map.setFilter('fuel-highlight', ['==', 'id', '']);
        });

        // Add popup on click
        map.on('click', 'fuel-layer', (e) => {
            const coordinates = e.lngLat;
            const properties = e.features[0].properties;

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`<strong>Location:</strong> ${properties.location}<br>
                          <strong>Fuel Type:</strong> ${properties.fuel_type}`)
                .addTo(map);
        });
    })
    .catch(error => {
        console.error('Error loading GeoJSON:', error);
    });

