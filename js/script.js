// Initialize and center the map over the US
var map = L.map('map').setView([32.339, -98.549], 5);

// Mapbox tile layer
var tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/fillmank/cm7jnr0ut00l201so6bs585u7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZmlsbG1hbmsiLCJhIjoiY203YzgyZ2V0MG1scjJrcHY3aW8wMGE2cyJ9.97L0-l7omtxjppq1qtuvKg', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 256, 
    zoomOffset: 0,
    maxZoom: 18
}).addTo(map);


// Load GeoJSON data
fetch('/data/fuel.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data).addTo(map);
    })
    .catch(error => {
        console.error('Error:', error);
    });
