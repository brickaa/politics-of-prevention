var twhpData = [{"ID":"TWHP","Map":"texastribune.WomensHealth-TWHP","Program":"Texas Women's Health Program","Enrollment":"About 117,000  women enrolled in an average month in fiscal year 2013","Eligibility":"Women ages 18 to 44 with income below 185 percent of the federal poverty line. U.S. citizens and some immigrants eligible.","Funding":"$36 million in state general revenue","Services":"Pelvic exams; STD screening and treatment; HIV screening; diabetes, blood pressure and cholesterol screening; breast and cervical cancer screening; clinical breast exams; Pap tests (initial test only) and contraceptives "}];
var fpData = [{"ID":"FP","Map":"texastribune.WomensHealth-FP","Program":"Family Planning Program","Enrollment":"About 49,000 women in fiscal year 2013","Eligibility":"Texans of \"child-bearing age\" who have not been sterilized and have incomes at or below 250 percent of the federal poverty line","Funding":"$21.6 million, including $18.8 million in state general revenue and $2.8 million in federal and other funds","Services":"Pelvic exams; STD screening and treatment; HIV screening; diabetes, blood pressure and cholesterol screenings; breast and cervical cancer screenings; clinical breast exams; Pap tests (initial and follow-up testing) and contraceptives"}];
var ephcData = [{"ID":"EPHC","Map":"texastribune.WomensHealth-EPHC","Program":"Expanded Primary Health Care Program","Enrollment":"About 170,000 women annually","Eligibility":"Women 18 and older who are Texas residents and have income at or below 200 percent of the federal poverty line","Funding":"$50 million in state general revenue","Services":"Pelvic exams; STD screening and treatment; HIV screening; diabetes, blood pressure and cholesterol screenings; breast and cervical cancer screening; clinical breast exams; Pap tests (initial and follow-up testing); immunizations and contraceptives"}];
var tvpmData = [{"ID":"TVPM","Map":"texastribune.WomensHealth-TVPM","Program":"Title V Prenatal","Enrollment":"About 14,000 women in fiscal year 2013 in the combined Title V prenatal medical and dental programs","Eligibility":"Women of \"child-bearing age\" who are Texas residents and have income at or below 185 percent of the federal poverty line","Funding":"$1.2 million in state general revenue, plus $291,000 in federal matching funds","Services":"Pelvic exams; STD screening and treatment; HIV screening; diabetes, blood pressure and cholesterol screenings; Pap tests; prenatal labs; ultrasounds;  dental services and a post-partum visit"}];
var tvpdData = [{"ID":"TVPD","Map":"texastribune.WomensHealth-TVPD","Program":"Title V Prenatal","Enrollment":"About 14,000 women in fiscal year 2013 in the combined Title V prenatal medical and dental programs","Eligibility":"Women of \"child-bearing age\" who are Texas residents and have income at or below 185 percent of the federal poverty line","Funding":"$1.2 million in state general revenue, plus $291,000 in federal matching funds","Services":"Pelvic exams; STD screening and treatment; HIV screening; diabetes, blood pressure and cholesterol screenings; Pap tests; prenatal labs; ultrasounds;  dental services and a post-partum visit"}];
var bccsData = [{"ID":"BCCS","Map":"texastribune.WomensHealth-BCCS","Program":"Breast and Cervical Cancer Screening","Enrollment":"About 43,000 women in fiscal year 2013","Eligibility":"Women 21 to 64 who are Texas residents and have incomes at or below 200 percent of the federal poverty line","Funding":"$2.9 million in state general revenue, plus $9.4 million in federal funds","Services":"Pelvic exams; blood pressure screenings; breast and cervical cancer screenings; clinical breast exams; Pap tests (initial and follow-up testing); mammograms; diagnostic services for women with abnormal breast or cervical cancer test results; cervical dysplasia treatment and individualized case management"}];

var templateTable = $("#table-template").html(); //script ID
$("#target").html(_.template(templateTable,{items:ephcData})); //html ID

//Create and add new Map Layer with gridLayer data
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
map.scrollWheelZoom.disable();
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
    $("#target").html(_.template(templateTable,{items:bccsData}));
  }
  if(activeMap === 'fp') {
    activeLayer = fp;
    $("#target").html(_.template(templateTable,{items:fpData}));
  }
  if(activeMap === 'twhp') {
    activeLayer = twhp;
    $("#target").html(_.template(templateTable,{items:twhpData}));
  }
  if(activeMap === 'tvpm') {
    activeLayer = tvpm;
    $("#target").html(_.template(templateTable,{items:tvpmData}));
  }
  if(activeMap === 'ephc') {
    activeLayer = ephc;
    $("#target").html(_.template(templateTable,{items:ephcData}));
  }
  if(activeMap === 'tvpd') {
    activeLayer = tvpd;
    $("#target").html(_.template(templateTable,{items:tvpdData}));
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