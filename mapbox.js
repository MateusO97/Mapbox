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

var panel_element = document.getElementById('deal-panel');


function openDealPanel() {
  document.getElementById('deal-panel').style.display = "block";
  document.getElementById('show-btn').style.display = "none";
  document.getElementById('close-btn').style.display = "block";
}

function closePanel() {
  document.getElementById('deal-panel').style.display = "none";
  document.getElementById('show-btn').style.display = "block";
  document.getElementById('close-btn').style.display = "none";
}

function buildDealList(data) {
  var listings = document.getElementById('listings');
  var listing = listings.appendChild(document.createElement('div'));
  var today = new Date().getTime();
  data.forEach(function(store, i){
    if (store.business.storedeals.length > 0
      && Date.parse(store.business.storedeals[0].dlsExpireDate) > today
      && store.business.storedeals[0].media) {
      //Create anchor to see deal
      var link = listing.appendChild(document.createElement('a'));
      link.href = store.storebizRoute;
      link.style = "color: black";
      // Create div with deal content
      var dealColumn = link.appendChild(document.createElement('div'));
      dealColumn.className = 'row pt-2 pt-md-2';
      dealColumn.style = "line-height: 0";

      // Create Div with deal images
      var dealImage = dealColumn.appendChild(document.createElement('div'));
      dealImage.className = 'col-md-5 col-5';

      // Create image tag
      var productImage = dealImage.appendChild(document.createElement('img'));
      productImage.src = 'https://dz8osaahf9pd7.cloudfront.net/filters:format(webp)/storage/' + store.business.storedeals[0].media.mdaLocalFileName;
      productImage.className = 'img-fluid';
      productImage.style = 'max-widht: 10em';

      // Create Div with deal informations
      var dealInformation = dealColumn.appendChild(document.createElement('div'));
      dealInformation.className = 'col-md col pt-3';

      var dealTittle = dealInformation.appendChild(document.createElement('h4'));
      dealTittle.className = 'bold pb-2';
      dealTittle.innerHTML = store.business.storedeals[0].dlsName;

      var dealParagraph = dealInformation.appendChild(document.createElement('p'));
      dealParagraph.innerHTML = store.business.storedeals[0].dlsApplyTo;

      var dealParagraph = dealInformation.appendChild(document.createElement('p'));
      dealParagraph.style = 'line-height: normal';
      dealParagraph.innerHTML = store.business.storeName;

      var dealType = dealInformation.appendChild(document.createElement('p'));
      dealType.innerHTML = store.business.storeplType;


    }

  });
}

var stores = data;
var map_container = new Vue({
  el: '#vue-filter',
  data: {
    stores: stores
  },
  template: '<div class="container-lg text-center" style="height: 5em">\
            <map-filter :atts="atts"/>\
            </div>',
  created: function() {
    this.atts = stores;
  }
})

Vue.component('map-filter', {
  template: '<div class="dropdown">\
              <button type="button" class="btn dropdown-toggle rounded-pill bg-white" id="cityFilterToggle" data-toggle="dropdown">\
                <i class="las la-map-marker"></i>\
                <span class="ml-1 mr-2">Barrie, ON</span>\
              </button>\
              <div class="dropdown-container p-4 dropdown-menu">\
                <div class="row mx-sm-5">\
                  <div class="col-12 col-md-6">\
                    <input type="text" v-model="search" @keyup="inputChanged"/>\
                    <div class="city-options">\
                      <div v-for="city in filteredCities" v-show="isOpen">\
                          <a class="city-list">{{ city }}</a>\
                        <br>\
                      </div>\
                    </div>\
                  </div>\
                </div>\
                <hr class="filter-divider">\
                <section>\
                  <div class="">\
                    <nav class="popular">\
                      <input value="Popular Areas" type="button" class="popular" v-on:click="debugTest">\
                      <input value="A-Z" type="button" class="alphabetical">\
                      <input value="Near By" type="button" class="nearBy pt-3 pt-lg1 pt-md1">\
                    </nav>\
                    <div class="col-12">\
                      <div class="pl-4" style="width: 50%">\
                      </div>\
                      <div class="container">\
                        <div class="col" v-for="city in city_filter">\
                          <a class="cities">\
                            <p>{{ city }}</p>\
                          </a>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </section>\
              </div>\
            </div>',
  props: ['atts'],
  data: function () {
    return {
      result: [],
      filteredCities: [],
      isOpen: false,
      search: ''
    }
  },
  created: function() {
    this.result = stores;
  },
  computed: {
    city_filter: function(){
      return [...new Set(this.result.map(i => i.storebizLocation))].sort()
    }
  },
  methods: {
    debugTest: function (event) {
      console.log(this.result);
    },
    inputChanged(event) {
      if (event.code == "ArrowUp" || event.code == "ArrowDown")
        return;

      this.filteredCities = [...new Set(this.result.map(i => i.storebizLocation))].sort();

      if (event.code == "Enter")
        return;

      var filtered = this.filteredCities.filter((filteredCities) => {
        return filteredCities.match(this.search)
      });

      this.isOpen = true
      this.filteredCities.push(...filtered)
    }

    }
});
new Vue({ el: '#vue-filter' })


map.on('load', function() {
console.log(stores);
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

 buildDealList(stores);
 // get_regions(stores);

});
