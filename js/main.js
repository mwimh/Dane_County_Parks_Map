// Declare global variables
var map;

// Create the basemap
function createMap() {
    map = L.map('map', {
        center: [43.07, -89.4],
        zoom: 11,
        maxZoom: 18,
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

    addFixedBoundaries(map);
};

//Function to extract park names
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

//Add overlay data to map
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

    fetch("data/daneTrails.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            trails = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "none",
                        color: "brown",
                        weight: 0.75,
                        opacity: 1,
                        className: 'trails'
                    }
                },
            });
            trails.addTo(map)
        })

    fetch("data/parks.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            parks = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "green",
                        color: "green",
                        weight: 3,
                        opacity: 0.8,
                        className: 'parks'
                    }
                },
                onEachFeature
            });
            parks.addTo(map)
        })


}

// Specify functions run at event triggers
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Highlight parks and generate park name tooltip on mouseover
function highlightFeature(e) {
    var zoomLvl = map.getZoom()

    if (zoomLvl > 14) {
        e.target.bindTooltip(e.sourceTarget.feature.properties.Name, { className: 'parkTooltip', offset: [100, 0] });
        e.target.openTooltip()
    } else {
        e.target.bindTooltip(e.sourceTarget.feature.properties.Name, { className: 'parkTooltip' });
        e.target.openTooltip()
    }

    e.target.setStyle({
        weight: 6,
        color: '#eaa40e',
    });
}

// Reset highlight to initial parameters
function resetHighlight(e) {
    parks.setStyle({
        fillColor: "green",
        color: "green",
        weight: 3,
        opacity: 0.8,
    })
}

// Zoom to park and generate popup on click
function zoomToFeature(e) {
    var parkCenter = e.target.getBounds().getCenter();
    map.flyTo(parkCenter, 15);

    var parkName = e.sourceTarget.feature.properties.Name

    if (parkName == "Morton Forest") {
        var parkNameShort = parkName.replace(" ", "")
        var popContent = parkName + '<br><span id="enhParkLink"><a href="lib/maps/' + parkNameShort + '.png" target="_blank">Enhanced Map</a>  <a href="lib/maps/' + parkNameShort + '.pdf" target="_blank">(PDF)</a></span><br><span id="daneCtyMaps"><a href="https://parks-lwrd.countyofdane.com/ParkSystem/List" target="_blank">Dane County Parks Maps</a></span>'
    } else {
        var popContent = parkName + '<br><span id="daneCtyMaps"><a href="https://parks-lwrd.countyofdane.com/ParkSystem/List" target="_blank">Dane County Parks Maps</a></span>'
    }

    e.target.bindPopup(popContent, { className: 'parkPopup', offset: [0, -50] })
    e.target.openPopup()
}

// Create the map once everything is loaded
document.addEventListener('DOMContentLoaded', createMap);