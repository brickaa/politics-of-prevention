(function() {

  var Contract = Backbone.Model.extend({

  }); // My model! Individual contracts.
  var Contracts = Backbone.Collection.extend({ // My collection of models/individual contracts.
    model: Contract,

    findForRegion: function(region) {
      return this.where({Region: region.get("Region")});
    }
  });
  var contracts = new Contracts();

  var Region = Backbone.Model.extend({
    findContracts: function() {
      return contracts.findForRegion(this);
    }
  }); // My model! Individual contracts.
  var Regions = Backbone.Collection.extend({ // My collection of models/individual contracts.
    model: Region
  });
  var regions = new Regions();


var ContractSelectView = Backbone.View.extend({
  el: '#region-select',
 
  events: {
    'change': 'selectNewActiveRegion'
  },
 
  initialize: function() {
    this.listenTo(this.collection, 'reset', this.render);
  },
 
  render: function() {
    var payload = [];
 
    this.collection.each(function(model) {
      var view = new IndividualSelectView({model: model});
      payload.push(view.render().el);
    });
 
    this.$el.append(payload);
  },
 
  selectNewActiveRegion: function() {
    var val = this.$el.val();
    var region = this.collection.findWhere({Region: val});
 
    activeRegion.set(region);
  },
 
  setActiveValue: function(val) {
    this.$el.val(val);
  }
});

var IndividualSelectView = Backbone.View.extend({
  tagName: 'option',
 
  template: _.template('<%= Name %>'),
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON())).attr('value', this.model.get('Region'));
    return this;
  }
});

var TotalView = Backbone.View.extend({
  el: '#table-data-totals',

  template: _.template($('#table-row-totals').html()),

  initialize: function() {
    this.listenTo(activeRegion, 'add', this.render);
  },

  render: function(model) {
    this.$el.html(this.template(model.toJSON()));
    return this;
  }
});

var contracts = new Contracts();
var activeRegion = new Backbone.Collection();
 
var contractSelectView = new ContractSelectView({collection: regions});
 
// var table = new ContractsView();
new TotalView(); 

regions.reset(regiondata);
contracts.reset(data);
activeRegion.set(regions.findWhere({Name: 'Central'}));
contractSelectView.setActiveValue(activeRegion.at(0).get("Region"));

var width = $(window).width();

var mapZoom = 6;
var mapCenter = [31.35, -99.64];

if(width < 767) {
  mapZoom = 5;
}


var map = L.mapbox.map('map', null, {
  minZoom: 5,
  maxZoom: 9,
  infoControl: {
    position: 'bottomright'
  }
});

var tileLayer = L.mapbox.tileLayer('texastribune.map-4xwafpgp,texastribune.ephc-contracts', {
  detectRetina: true
}).addTo(map);

var gridLayer = L.mapbox.gridLayer('texastribune.ephc-contracts');

gridLayer.on('click', function(e) {
    if (!e.data) { return; }
    var RegionId = e.data['TxCoFIPS_5'];
    var region = regions.findWhere({Region: RegionId});
    activeRegion.set(region);
    contractSelectView.setActiveValue(activeRegion.at(0).get("Region"));
});

gridLayer.addTo(map);

map.setView(mapCenter, mapZoom);
map.scrollWheelZoom.disable();
})();

function commas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}