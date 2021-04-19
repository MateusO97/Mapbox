// Map via Mapbox GL
mapboxgl.accessToken = 'pk.eyJ1IjoibWV0cmljb24iLCJhIjoiY2l3eTQxMWl3MDBmYTJ6cWg3YmZtdjdsMSJ9.2vDbTw3ysscpy3YWkHo6aA';
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/light-v10',
  center: [data[0].business.storeLongitude, data[0].business.storeLatitude], // Starting position [lng, lat]
  zoom: 10 // Starting zoom level
});

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());


map.on('load', function() {
  
 var stores = data;
 stores.forEach(function(store, i) {
   new mapboxgl.Marker()
   .setLngLat([store.business.storeLongitude,store.business.storeLatitude])
   .addTo(map);
 });




});
