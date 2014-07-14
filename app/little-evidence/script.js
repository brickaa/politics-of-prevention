function commas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var width = $(window).width();

var mapZoom = 6;
var markerRadius = 9;

if(width < 800) {
  mapZoom = 5;
  markerRadius --;
}

if(width < 520) {
  mapZoom = 4;
  markerRadius -= 2;
}

if(width > 480) {
  $('#mapLegendContainer').addClass('mapLegendOnMap').appendTo("#map");
}

var layer = L.mapbox.tileLayer('texastribune.map-f9zh0xcn', {
  detectRetina: true,
  retinaVersion: 'texastribune.map-v9ed8kfi'
});

var map = L.mapbox.map('map');
map.addLayer(layer).setView([31.33, -99.56], mapZoom);
map.scrollWheelZoom.disable();

var Facility = Backbone.Model.extend({
  defaults: {
    loc: null,
    color: 'rgb(0,0,0)'
  },

  initialize: function() {
    this.createLeafletLocation();
    this.determineColor();
  },

  createLeafletLocation: function() {
    var lat = this.get('lat');
    var lon = this.get('lon');

    if(lat && lon) {
      var latLng = L.latLng([this.get('lat'), this.get('lon')]);
      this.set('loc', latLng);
    }
  },

  determineColor: function() {
    var color = this.get('color');
    var priority = this.get('ClosedClosing').toUpperCase();

    if (priority === 'OPEN') { color = 'rgb(27, 158, 119)'; }
    if (priority === 'CLOSED') { color = 'rgb(217, 95, 2)'; }
    if (priority === 'STOPPED') { color = 'rgb(117, 112, 179)'; }

    this.set('color', color);
  },
});

var Facilities = Backbone.Collection.extend({
  model: Facility
});

var facilities = new Facilities(data);

// var FacilityRow = Backbone.View.extend({
//   tagName: 'tr',

//   template: _.template($('#row-template').html()),

//   events: {
//     'click .view-on-map': 'zoomMap'
//   },

//   render: function() {
//     this.$el.html(this.template(this.model.toJSON()));
//     return this;
//   },

//   zoomMap: function() {
//     var top = $(document).scrollTop();
//     var mapTop = $('#map').offset().top - 10;

//     if(top > mapTop) {
//       $('html, body').animate({
//         scrollTop: mapTop
//       }, 300);
//     }
//     map.setView(this.model.get('loc'), 11);
//     this.model.get('marker').openPopup();
//   }

// });

// var FacilityTableBundle = Backbone.View.extend({
//   el: '#facility-rows',

//   initialize: function() {
//     this.addAllToList(facilities);
//   },

//   addAllToList: function(coll) {
//     var payload = [];
//     coll.each(function(c) {
//       var view = new FacilityRow({model: c});
//       payload.push(view.render().el);
//     });

//     this.$el.html(payload);

//     TableSift.init('sortable', {
//       customSort: {
//         4: function(t, el) {
//           return isNaN(Date.parse(t)) ? 0 : Date.parse(t);
//         }
//       }
//     });

//   }
// });

var popupTemplate = _.template($('#popup-template').html());

// new FacilityTableBundle();

facilities.each(function(c) {
  var loc = c.get('loc');
  if(loc) {
    var marker = L.circleMarker(c.get('loc'), {
      radius: markerRadius,
      weight: 5,
      fillOpacity: 0.8,
      fillColor: c.get('color'),
      stroke: false,
      color: '#FFFFFF'
    });

    marker.bindPopup(popupTemplate(c.attributes));
    c.set('marker', marker);
    map.addLayer(marker);
  }
});
