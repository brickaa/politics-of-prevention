(function() {
    var cssLink = $("<link>");
    var cssLink2 = $("<link>");
    $("head").append(cssLink);
    cssLink.attr({
      rel:  "stylesheet",
      type: "text/css",
      href: "//api.tiles.mapbox.com/mapbox.js/v1.5.2/mapbox.css"
    });
 
    $("head").append(cssLink2);
    cssLink2.attr({
      rel:  "stylesheet",
      type: "text/css",
      href: "//s3.amazonaws.com/static.texastribune.org/data/twhp-interactive/style.css"
    });
 
    $('#canvas-hook').append($("<canvas>").addClass('chart-container').attr('id', 'chart-container'));
})();

var County = Backbone.Model.extend({
  defaults: {
    labels: ['Wellness exams', 'Sterilzation', 'Education or Counseling', 'Long-acting, Reversible Contraception (Intra-uterine Device, Implant)', 'Barrier Contraception (Condom, Diaphragm, Cervical Cap, Spermicide)', 'Hormonal Contraception (Pill, Patch, Ring, Injection)']
  },
 
  returnCountBundle: function() {
    var self = this;
 
    var payload = [];
 
    _.each(this.get('labels'), function(v,i) {
      payload.push({
        type: v,
        total2012: self.get('jj12')[i],
        total2013: self.get('jj13')[i]
      });
    });
 
    return payload;
  },
 
});
var Counties = Backbone.Collection.extend({
  model: County,
 
  comparator: 'county'
});
var CountySelectView = Backbone.View.extend({
  el: '#county-select',
 
  events: {
    'change': 'selectNewActiveCounty'
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
 
  selectNewActiveCounty: function() {
    var val = this.$el.val();
    var county = this.collection.findWhere({fips: val});
 
    activeCounty.set(county);
  },
 
  setActiveValue: function(val) {
    this.$el.val(val);
  }
});
 
var IndividualSelectView = Backbone.View.extend({
  tagName: 'option',
 
  template: _.template('<%= county %>'),
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON())).attr('value', this.model.get('fips'));
    return this;
  }
});
 
var BarChartView = Backbone.View.extend({
  el: '#chart-container',
  labels: ['Wellness exams', 'Sterilzation', 'Education', 'Long-acting', 'Barrier', 'Hormone'],
 
  initialize: function() {
    this.listenTo(activeCounty, 'add', this.renderChart);
  },
 
  renderChart: function(model) {
    var parentWidth = this.$el.parent().width();
    var height = $(window).width() > 767 ? 400 : 350;
 
    this.$el.attr({width: parentWidth, height: height});
 
    this.chart = new Chart(this.el.getContext('2d'));
 
    this.chart.Bar({
      labels: this.labels,
      datasets: [{
        fillColor : 'rgba(55, 157, 146, 0.5)',
        strokeColor : 'rgba(55, 157, 146, 1)',
        data : model.get('jj12')
      },{
        fillColor : 'rgba(155, 206, 200, 0.5)',
        strokeColor : 'rgba(155, 206, 200, 1)',
        pointColor : 'rgba(151,187,205,1)',
        pointStrokeColor : '#fff',
        data : model.get('jj13')
      }]
    },{
      scaleFontFamily: "'Helvetica', 'Arial', sans-serif",
      scaleShowLabels : false,
    });
  }
});
 
var TableView = Backbone.View.extend({
  el: '#table-data',
 
  template: _.template($('#table-row').html()),
 
  initialize: function() {
    this.listenTo(activeCounty, 'add', this.render);
  },
 
  render: function(model) {
    var self = this;
 
    var payload = '';
    var data = model.returnCountBundle();
 
    _.each(data, function(temp) {
      payload += self.template(temp);
    });
 
    this.$el.html(payload);
  }
});
 
var TableProviderView = Backbone.View.extend({
  el: '#table-data-providers',
 
  template: _.template($('#table-row-providers').html()),
 
  initialize: function() {
    this.listenTo(activeCounty, 'add', this.render);
  },
 
  render: function(model) {
    this.$el.html(this.template(model.toJSON()));
    return this;
  }
});
function commas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
 
var counties = new Counties();
var activeCounty = new Backbone.Collection();
 
var countySelectView = new CountySelectView({collection: counties});
 
new BarChartView();
new TableView();
new TableProviderView();
 
counties.reset(countyData);
activeCounty.set(counties.findWhere({county: 'Statewide'}));
