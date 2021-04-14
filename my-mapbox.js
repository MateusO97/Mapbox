// Map via Mapbox GL

function CurrentYear() {
  var thisYear = new Date().getFullYear()
  $("#currentYear").text(thisYear);
}

mapboxgl.accessToken = 'pk.eyJ1IjoibWV0cmljb24iLCJhIjoiY2l3eTQxMWl3MDBmYTJ6cWg3YmZtdjdsMSJ9.2vDbTw3ysscpy3YWkHo6aA';
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: [-122.25948, 37.87221], // Starting position [lng, lat]
  zoom: 12 // Starting zoom level
});

var marker = new mapboxgl.Marker() // Initialize a new marker
  .setLngLat([-122.25948, 37.87221]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

var geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: 'Search for a place', // Placeholder text for the search bar
});

// Add the geocoder to the map
map.addControl(geocoder);

// After the map style has loaded on the page,
// add a source layer and default styling for a single point
map.on('load', function () {

  map.addSource('coordinates', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  });


  // Add a new layer to visualize the polygon.
  map.addLayer({
    'id': 'fillcity',
    'type': 'fill',
    'source': 'coordinates', // reference the data source
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
    'source': 'coordinates',
    'layout': {},
    'paint': {
      'line-color': '#000',
      'line-width': 3
    }
  });
});

  // Listen for the `result` event from the Geocoder // `result` event is triggered when a user makes a selection
  //  Add a marker at the result's coordinates
  geocoder.on('result', function (e) {
    map.getSource('coordinates').setData(e.result.geometry);
    document.getElementById("zip").innerHTML = JSON.stringify(e.result.context[0].text);
    document.getElementById("address").innerHTML = JSON.stringify(e.result.text);
    document.getElementById("city").innerHTML = JSON.stringify(e.result.context[1].text);
    document.getElementById("state").innerHTML = JSON.stringify(e.result.context[2].text);
    document.getElementById("country").innerHTML = JSON.stringify(e.result.context[3].text);
    console.log(e.result);


  });
