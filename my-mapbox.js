// Map via Mapbox GL

function CurrentYear() {
  var thisYear = new Date().getFullYear()
  $("#currentYear").text(thisYear);
}

mapboxgl.accessToken = 'pk.eyJ1IjoibWV0cmljb24iLCJhIjoiY2l3eTQxMWl3MDBmYTJ6cWg3YmZtdjdsMSJ9.2vDbTw3ysscpy3YWkHo6aA';
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: [-48.043782, -15.841599], // Starting position [lng, lat]
  zoom: 10 // Starting zoom level
});

var marker = new mapboxgl.Marker() // Initialize a new marker
  .setLngLat([-48.043782, -15.841599]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

var geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
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
      }
      if(v.id.indexOf('district') >= 0) {
        place = v.text;
      }
      if(v.id.indexOf('region') >= 0) {
        region = v.text;
      }
      if(v.id.indexOf('country') >= 0) {
        countryName = v.text;
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
