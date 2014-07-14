//Create and add new Map Layer with gridLayer data
console.log("hi");
function prepareLayers(baseLayer, retinaBaseLayer, displayLayer) {
  var layer = L.mapbox.tileLayer(baseLayer + ',' + displayLayer, {
    detectRetina: true,
    retinaVersion: retinaBaseLayer + ',' + displayLayer
  });

  var gridLayer = L.mapbox.gridLayer(displayLayer);

  gridLayer.on('click', function(e) {
      popup.setLatLng(e.latLng).setContent(popupTemplate(e.data)).openOn(map);
  });

  return L.layerGroup([layer, gridLayer]);
}

//Background Tiles
var bgTiles = {
  'normal': 'texastribune.map-f9zh0xcn',
  'retina': 'texastribune.map-mwov7r6w'
}

var mapZoom = 6;
var mapCenter = [31.35, -99.64];

//Call Pop-up
var popup = L.popup();
//Assign Popup Template to Underscore Template (in HTML)
var popupTemplate = _.template($('#popup-template').html());
//Assign #option-select in HTML to JQuery function
var $optionSelect = $('#option-select');
var activeLayer;

//Make Map width responsive
var width = $(window).width();

if(width < 960) {
  mapZoom = 5;
}

if(width < 480) {
  mapZoom = 5;
  mapCenter = [31.33, -99.56];
}

//Basic map settings
var map = L.mapbox.map('map', null, {
  minZoom: 5,
  maxZoom: 9
});
map.setView(mapCenter, mapZoom);

//Assign vars to Map Layers
var bccs = prepareLayers(bgTiles['normal'], bgTiles['retina'], 'texastribune.WomensHealth-BCCS');
var fp = prepareLayers(bgTiles['normal'], bgTiles['retina'], 'texastribune.WomensHealth-FP');
var twhp = prepareLayers(bgTiles['normal'], bgTiles['retina'], 'texastribune.WomensHealth-TWHP');
var tvpm = prepareLayers(bgTiles['normal'], bgTiles['retina'], 'texastribune.WomensHealth-TVPM');
var ephc = prepareLayers(bgTiles['normal'], bgTiles['retina'], 'texastribune.WomensHealth-EPHC');
var tvpd = prepareLayers(bgTiles['normal'], bgTiles['retina'], 'texastribune.WomensHealth-TVPD');


//Find selected val and set active Map Layer
function findVal(activeMap) {
  if(activeLayer) {
    map.removeLayer(activeLayer);
  }
  if(activeMap === 'bccs') {
    activeLayer = bccs;
  }

  if(activeMap === 'fp') {
    activeLayer = fp;
  }

  if(activeMap === 'twhp') {
    activeLayer = twhp;
  }

  if(activeMap === 'tvpm') {
    activeLayer = tvpm;
  }

  if(activeMap === 'ephc') {
    activeLayer = ephc;
  }

  if(activeMap === 'tvpd') {
    activeLayer = tvpd;
  }

  map.addLayer(activeLayer);
}

//Switch layers function
$optionSelect.change(function() {
  var val = this.value;
  findVal(val);
});

//Call first val option on Ready
$(document).ready(function() {
  var val = $optionSelect.val();
  findVal(val);
});