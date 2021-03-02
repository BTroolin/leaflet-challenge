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

var make_legend = () => {
    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = () => {
        var infos = L.DomUtil.create("div", "legend");
        var mags = [0, 1, 2, 3, 4, 5];

        mags.forEach(mag => {
            var mag_range = `${mag}-${mag+1}`;
            if (mag >= 5) {mag_range = '${mag}+'}
            var html = `<div class="legend-item">
                    <div style="height: 30px; width: 30px; background-color:${mag_color(mag)}">
                    <div class = legend-text>${mag_range}</div> 
                </div>`
            infos.innerHTML += html
        });
        return infos;
    };
    return info;
}

var get_map = map_type => {
    var one_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: map_type,
        accessToken: API_KEY
    });
    return one_map
}

var create_map = layer_list => {
    var base_maps = {
        Satellite: get_map("mapbox.satellite"),
        Grayscale: get_map("mapbox.grayscale"),
        Outdoors: get_map("mapbox.outdoors")
    };

    var overlay_maps = {
        "Fault Lines": layer_list.faultlines,
        "Earthquakes": layer_list.earthquakes
    };

    var mymap = L.map("map", {
        center: [40, -100],
        zoom: 5,
        layers: [base_maps.Satellite, overlay_maps["Fault Lines"], overlay_maps["Earthquakes"]]
    });

    L.control.layers(base_maps, overlay_maps, {
        collapsed: false
    }).addTo(mymap);
    make_legend().addTo(mymap);
}
