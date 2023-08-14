// Declare global variables
var map;
var dataStats = {};


// Create the basemap
function createMap() {
    map = L.map('map', {
        center: [43.07, -89.4],
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

    //map.invalidateSize()

    addFixedBoundaries(map);
};


function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

function addFixedBoundaries(map) {

    fetch("data/backGrnd.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            backGrnd = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "black",
                        className: 'backGrnd',
                        weight: 0
                    }
                }
            });
            backGrnd.addTo(map)
        })

    fetch("data/daneCtyBorder.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            daneCty = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "none",
                        color: "#4B83A4",
                        weight: 6,
                        opacity: 1,
                        className: 'daneCty'
                    }
                }
            });
            daneCty.addTo(map)
        })

    fetch("data/parks.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            parks = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "none",
                        color: "green",
                        weight: 2,
                        opacity: 0.8,
                        className: 'parks'
                    }
                }
            });
            parks.addTo(map)
        })


}



// Create the map once everything is loaded
document.addEventListener('DOMContentLoaded', createMap);