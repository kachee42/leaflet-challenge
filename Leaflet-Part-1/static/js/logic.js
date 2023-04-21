// Store Endpoint as url
var monthUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Read in Geojson data and check it in the console
d3.json(monthUrl).then(function (data) {
    console.log(data.features);

    // Pass data.features into createFeatures function
    createMarkers(data.features);
});

// Create map centered over 0 lat, 0 long at zoom level 3
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 3
});

// Create street map tile layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create getColor function for legend and marker coloring
function getColor(depth) {
    if (depth <= 10) {
        color = "#1a9850"
    } else if (depth <= 30) {
        color = "#91cf60"
    } else if (depth <= 50) {
        color = "#d9ef8b"
    } else if (depth <= 70) {
        color = "#fee08b"
    } else if (depth <= 90) {
        color = "#fc8d59"
    } else {
        color = "#d73027"
    };
    return color;
}

// Define createMarkers function
function createMarkers(earthquakeData) {
    
    // Loop through array
    for (let i = 0; i < earthquakeData.length; i++) {

        // Add circles to the map
        L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
            fillOpacity: 0.50,
            color: "black",
            fillColor: getColor(earthquakeData[i].geometry.coordinates[2]),
            weight: 0.5,
            radius: earthquakeData[i].properties.mag * 50000
        // Bind popup with the data on the earthquake
        }).bindPopup(
            `<h2>${earthquakeData[i].properties.title}</h2>
             <hr> 
             <h3>Type: ${earthquakeData[i].properties.type}</h3>
             <h3>Magnitude: ${earthquakeData[i].properties.mag}</h3>
             <h3>Date/Time: ${new Date(earthquakeData[i].properties.time)}</h3>`)
        .addTo(myMap);   
    }   
}

var legend = L.control({position: "bottomright"});

legend.onAdd = function (map) {
    
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    };
      
    return div;
};

legend.addTo(myMap);
