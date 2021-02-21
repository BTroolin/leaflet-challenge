// url for weekly usgs earthquake data
//var QuakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var quakes = "data/quakes.json";
// url for tectonic plates borders
//var PlateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
var plates = "data/PB2002_plates.json";
var mag_radius = mag => mag * 20000;

var mag_color = magnitude => {
    var a = 1.0;
    if (magnitude < 1) {
        return `rgba(200,255,0,${a})`
    } else if (magnitude < 2) {
        return `rgba(211,204,0,${a})`
    } else if (magnitude < 3) {
        return `rgba(222,153,0,${a})`
    } else if (magnitude < 4) {
        return `rgba(233,102,0,${a})`
    } else if (magnitude < 5) {
        return `rgba(244,51,0,${a})`
    } else {
        return `rgba(255,0,0,${a})`
    }
}

d3.json(quakes, data => {
  data.json(plates, plate_data =>{
    var layers = {
      earthquakes: getEarthquakes(data),
      faultlines: getFaultlines(plate_data)
    };
    createMap(layers);
  });
});

var get_faults = plate_data => {
    var plate_lines = L.geoJSON(plate_data, {
        color: "yellow",
        fillOpacity: 0
    })
    return plate_lines;
}

var get_quakes = quake_data => {
    var cmarkers = [];
    quake_data.features.forEach(feature => {
        var crd = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        var one_marker = L.circle(crd, {
            stroke: false,
            color : mag_color(feature.properties.mag),
            fillColor: mag_color(feature.properties.mag),
            fillOpacity: 1,
            radius: mag_colors(feature.properties.mag)
        });

        one_marker.bindPopup(
            "<h3>" + feature.properties.place + "<br>Magnitude: " + feature.properties.mag + "<br>Time: " + new Date(feature.properties.time)
        );
        cmarkers.push(one_marker);
    });

    return L.layerGroup(cmarkers);
}













//OSM tiles attribution and URL
// var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
// var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
// var osmAttrib = '&copy; ' + osmLink;

// //Carto tiles attribution and URL
// var cartoLink = '<a href="http://cartodb.com/attributions">CartoDB</a>';
// var cartoURL = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
// var cartoAttrib = '&copy; ' + osmLink + ' &copy; ' + cartoLink;

// //Stamen Toner tiles attribution and URL
// var stamenURL = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}';
// var stamenAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// //Elevation tiles attribution and URL
// var ElevationLink = '<a href="https://www.openstreetmap.org/copyright">Elevation</a>';
// var ElevationURL = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
// var ElevationAttrib = '&copy; ' + ElevationLink;

// //Creation of map tiles
// var ElevationMap = L.tileLayer(ElevationURL, { attribution: ElevationAttrib });
// var osmMap = L.tileLayer(osmURL, { attribution: osmAttrib });
// var cartoMap = L.tileLayer(cartoURL, { attribution: cartoAttrib });
// var stamenMap = L.tileLayer(stamenURL, {
//     attribution: stamenAttrib,
//     subdomains: 'abcd',
//     minZoom: 0,
//     maxZoom: 20,
//     ext: 'png'
// });

//Map creation
// var map = L.map('map',{
//     layers: [osmMap]
// }).setView([42.846787, -4.451736], 8);

// //Base layers definition and addition
// var baseLayers = {
//     "OSM Mapnik": osmMap,
//     "Carto DarkMatter": cartoMap,
//     "Stamen Toner": stamenMap,
//     "Elevation": ElevationMap
// };

//  //Add baseLayers to map as control layers
//  L.control.layers(baseLayers).addTo(map);