// scale the circle markers based on magnitude
var magToRadius = mag => mag * 20000;
// set marker colors based on magnitude
var mag_colors = magnitude => {
    var a = 1.0;
    if (magnitude < 1) {
        return `rgba(200,255,0,${a})`
    } else if (magnitude < 2) {
        return `rgba(210,200,0,${a})`
    } else if (magnitude < 3) {
        return `rgba(220,150,0,${a})`
    } else if (magnitude < 4) {
        return `rgba(230,100,0,${a})`
    } else if (magnitude < 5) {
        return `rgba(245,50,0,${a})`
    } else {
        return `rgba(255,0,0,${a})`
    }
}

// Import the data pulled from the USGS server
var link = "static/data/earthquake.geojson";
var linktectonicplates = "static/data/PB2002_plates.json";
// put the plate and earthquake data into a layerlist
d3.json(link, data => {
    d3.json(linktectonicplates,tpdata =>{
        var layerList = {
            earthquakes: get_Earthquakes(data),
            faultlines: get_Faultlines(tpdata)
        };
        createMap(layerList);
    });
});
// set how the fault lines display
var get_Faultlines = tpdata => {
    var plateLines = L.geoJSON(tpdata, {
        color: "yellow", 
        fillOpacity: 0
    })
    return plateLines;
}
// get the quake data and assign circle marker values based on magnitude
var get_Earthquakes = earthquakeData => {
    var cmarkers = [];
    earthquakeData.features.forEach(feature => {
        var crd = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        var onemarker = L.circle(crd, {
            stroke: false,
            color: mag_colors(feature.properties.mag),
            fillColor: mag_colors(feature.properties.mag),
            fillOpacity: 1,
            radius: magToRadius(feature.properties.mag)
        });

        onemarker.bindPopup(
            "<h3>" + feature.properties.place + "<br>Magnitude: " + feature.properties.mag
            + "<br>Time: " + new Date(feature.properties.time)
        );
        cmarkers.push(onemarker);
    });

    return L.layerGroup(cmarkers);
}
// set up the map legend
var get_Legend = () => {
    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = () => {
        var infodiv = L.DomUtil.create("div", "legend");
        var mags = [0, 1, 2, 3, 4, 5];

        mags.forEach(mag => {
            var magRange = `${mag}-${mag+1}`;
            if (mag >= 5) { magRange = `${mag}+`}
            var html = `<div class="legend-item">
                    <div style="height: 25px; width: 25px; background-color:${mag_colors(mag)}"> </div>
                    <div class=legend-text>${magRange}</div>
                </div>`
            infodiv.innerHTML += html
        });
        return infodiv;
    };

    return info;
}
//make the map with mapbox tilesets
var getMap = maptype => {
    var onemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: maptype,
        accessToken: API_KEY
    });
    return onemap;
}
// add basemap options and overlays
var createMap = layerList => {
    var baseMaps = {
        Satellite: getMap("mapbox.satellite"),
        Countries: getMap("mapbox.country-boundaries-v1"),
        Streets: getMap("mapbox.mapbox-streets-v8")
    };

    var overlayMaps = {
        "Fault Lines": layerList.faultlines,
        Earthquakes: layerList.earthquakes
    };
    // set the starting zoom and center to show quakes in North America
    var myMap = L.map("map", {
        center: [40, -110],
        zoom: 4,
        layers: [baseMaps.Satellite,overlayMaps["Fault Lines"], overlayMaps.Earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    get_Legend().addTo(myMap);
}