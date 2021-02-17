// url for weekly usgs earthquake data
var QuakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// url for tectonic plates borders
var PlateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiYnRyb29saW4iLCJhIjoiY2s5MjZ2OW55MDVldDNobDVsN3Jybmk4YyJ9.bAKA3BfCyOkpSZZYA24KYw"
  }).addTo(myMap);























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