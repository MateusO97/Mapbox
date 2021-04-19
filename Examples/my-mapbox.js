// Map via Mapbox GL

mapboxgl.accessToken = 'pk.eyJ1IjoibWV0cmljb24iLCJhIjoiY2l3eTQxMWl3MDBmYTJ6cWg3YmZtdjdsMSJ9.2vDbTw3ysscpy3YWkHo6aA';
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: [-79.3849, 43.6529], // Starting position [lng, lat]
  zoom: 10 // Starting zoom level
});

var geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  language: 'en', // Do not use the default marker style
  placeholder: 'Search for a place', // Placeholder text for the search bar
  flyTo: {
    easing: function(t) {
      return t;
    },
    maxZoom: 8, // If you want your result not to go further than a specific zoom
  }
});

// Add the geocoder to the map
map.addControl(geocoder);

// After the map style has loaded on the page,
// add a source layer and default styling for a single point

function get_location_name(geoData) {
  // debugger;
  var region, countryName, place, returnStr, district;
  if(geoData.context){
    $.each(geoData.context, function(i, v){
      if(v.id.indexOf('place') >= 0) {
        place = v.text;
        document.getElementById("city").innerHTML = v.text;
      }
      if(v.id.indexOf('district') >= 0) {
        district = v.text;
        document.getElementById("city").innerHTML = v.text;
      }
      if(v.id.indexOf('region') >= 0) {
        region = v.text;
        document.getElementById("state").innerHTML = v.text;
      }
      if(v.id.indexOf('country') >= 0) {
        countryName = v.text;
        document.getElementById("country").innerHTML = v.text;
      }
    });
  }
  if(district) {
    returnStr = district;
  }
  if(district == null) {
    returnStr = place;
  }
  if(place == null) {
    returnStr = region;
  }
  if (region == null) {
    returnStr = geoData.place_name;
  }
  return returnStr;
}

function get_osm_id(location_name) {
  var request = new XMLHttpRequest();
  var osm_id;
  url = 'https://nominatim.openstreetmap.org/?addressdetails=1&q=';
  params = location_name;
  format = '&format=json&limit=1';
  request.open('GET', url + params + format, true)
  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
      osm_id = data[0].osm_id;
      callback(osm_id);
    } else {
      console.log('error')
    }
  }

  request.send()
}

function callback(result) {
  get_polygon_coordinates(result);
}

function get_polygon_coordinates(osm_id) {
  var request = new XMLHttpRequest();
  var polygon;
  url = 'https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=';
  params = osm_id;
  format = '&class=boundary&addressdetails=1&hierarchy=0&group_hierarchy=1&polygon_geojson=1&format=json';
  request.open('GET', url + params + format, true)
  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
      // console.log(data);
      polygon = data;
      print_polygon(polygon);
      // console.log(data[0].osm_id);
    } else {
      console.log('error')
      document.getElementById("error_message").style.display = "inline";
    }
  }

  request.send()
}

function print_polygon(polygon) {
  document.getElementById("error_message").style.display = "none";
  document.getElementById("information_panel").style.display = "block";
  let coordenadas = polygon.geometry.coordinates;

  if(map.getLayer('fillcity')) {
    map.removeLayer('fillcity');
  }
  if(map.getLayer('outline')) {
    map.removeLayer('outline');
  }
  if(map.getSource('city_polygon')) {
    map.removeSource('city_polygon');
  }

  map.addSource('city_polygon', {
'type': 'geojson',
'data': {
'type': 'Feature',
'geometry': {
'type': 'Polygon',
// These coordinates outline Maine.
'coordinates': coordenadas
}
}
});


  // Add a new layer to visualize the polygon.
  map.addLayer({
    'id': 'fillcity',
    'type': 'fill',
    'source': 'city_polygon', // reference the data source
    'layout': {},
    'paint': {
      'fill-color': '#0080ff', // blue color fill
      'fill-opacity': 0.5
    }
  });
  // Add a black outline around the polygon.
  map.addLayer({
    'id': 'outline',
    'type': 'line',
    'source': 'city_polygon',
    'layout': {},
    'paint': {
      'line-color': '#000',
      'line-width': 3
    }
  });
}


geocoder.on('result', function (e) {
  console.log(e.result);
  location_name = get_location_name(e.result)
  osm_id = get_osm_id(location_name)
});
