// Declare global variables
var map;
var dataStats = {};


// Create the basemap
function createMap() {
    map = L.map('map', {
        center: [43.10, -89.4],
        zoom: 11,
        maxZoom: 19,
        minZoom: 10,
        maxBounds: [
            //south west
            [42.5, -91],
            //north east
            [44, -88]
        ],
        maxBoundsViscosity: 1.0,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);

    map.invalidateSize()

    //getData();
};


function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}






// Create the map once everything is loaded
document.addEventListener('DOMContentLoaded', createMap);