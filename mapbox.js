// Map via Mapbox GL
mapboxgl.accessToken = 'pk.eyJ1IjoibWV0cmljb24iLCJhIjoiY2l3eTQxMWl3MDBmYTJ6cWg3YmZtdjdsMSJ9.2vDbTw3ysscpy3YWkHo6aA';
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-79.69347, 44.377433], // Starting position [lng, lat]
  zoom: 12 // Starting zoom level
});

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());


map.on('load', function() {

console.log(data[0].business.storeLongitude);
console.log(data[0].business.storeLatitude);
console.log(data[0]);

 var stores = data;
 stores.forEach(function(store, i) {
   new mapboxgl.Marker()
   .setLngLat([store.business.storeLongitude,store.business.storeLatitude])
   .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML(
      '<div class="limbet-square">' +
        '<img src="https://dz8osaahf9pd7.cloudfront.net/images/assets/featuredribbon.png" alt="View More Details" style="position:absolute; transform: translate(-20%,-13%);">' +
        '<div class="limbet-img">' +
          '<img src=' + store.storebizLogo + '>' +
        '</div>' +
        '<div class="limbet-header">' +
          '<strong>' + store.business.storeName + '</strong>' +
          '<div class="small">' +
            '<strong>' + store.storebizLocation + '</strong>' +
            '<br>' +
            '<div>' +
              '<span class="las la-star"></span>' + store.business.storervwAverage +
            '</div>' +
          '</div>' +
        '</div>' +
     '</div>'
   ))
   .addTo(map);
 });




});
