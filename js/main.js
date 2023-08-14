// Declare global variables
var map;
var dataStats = {};


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

            console.log(parks)
        })


}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

//highlight function
function highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
        weight: 6,
        color: '#eaa40e',
    });

    e.target.bindPopup("I am a Park.");

}

function createPopup(e) {
    e.target.bindPopup("I am a Park.");
}


//function to reset highlight to initial parameters
function resetHighlight(e) {
    parks.setStyle({
        fillColor: "green",
        color: "green",
        weight: 3,
        opacity: 0.8,
    })
}

function zoomToFeature(e) {
    //reset huc10 style initially to remove previous color change
    //fly to the center of the selected huc10
    parkCenter = e.target.getBounds().getCenter();
    map.flyTo(parkCenter, 15);
}

function PopupContent(properties, attribute) {
    this.properties = properties;
    this.attribute = attribute;
    this.employment = properties[attribute];
    this.formatted = "<p><b>Country:</b> " + this.properties.Country + "</p><p><b>" + "Industry Emp. in " + this.year + ":</b> " + Math.round(this.properties[attribute] * 10) / 10 + "%</p>" + "<p><b>28-Year Change:</b> " + this.change + "%</p>";
};

// Create the map once everything is loaded
document.addEventListener('DOMContentLoaded', createMap);