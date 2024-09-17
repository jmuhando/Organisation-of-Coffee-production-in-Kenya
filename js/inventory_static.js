var map = L.map('map', {zoomControl: false}).setView([-0.085091, 37.497650], 6 );
// var osmlayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.addControl(L.control.zoom({position:'topright'}));
map.setMaxBounds(map.getBounds());
var style_belt = {
    "color": "white",
    "weight": 1,
    "opacity": 1,
    "fillColor": "#008c4d",
    "fillOpacity": 0.8
};
var style_counties = {
    "color": "#ED1C1C",
    "weight": 1.5,
    "opacity": 0.5,
    "dashArray": 2,
    "fillColor": "white",
    "fillOpacity": 0.3
};

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.bindPopup(feature.properties.NAME);
    layer.on({
    	click: zoomToFeature 	   
    });    
}
        

var zones = L.geoJson(counties,{style:style_counties}).addTo(map);

var geoLayer = L.geoJson(belt,{onEachFeature:onEachFeature}).addTo(map);

var geoList = new L.Control.GeoJSONList(geoLayer, {style:style_belt,
    listItemBuild: function(layer) {
    var item = L.DomUtil.create('div','legendary');
    item.innerHTML = L.Util.template('<b>{NAME}</b>', layer.feature.properties);
            return item;
        }
    });

geoList.on('item-active', function(e,layer) {
legend.removeFrom(map);
            choice=e.layer.feature.properties.district ;
            var county_belt = _.groupBy(producers.features, function(p){ 
              return (p.properties.County_Ref);
            });
            var picked=_.pick(county_belt, e.layer.feature.properties.District);
            var county_pick1=_.pick(picked, e.layer.feature.properties.District);
            var county_pick=_.values(picked);
            //console.log(county_pick);
            var catego = _.groupBy(county_pick[0], function(p){ 
              return (p.properties.Category);
            }); 
            var divNo= (_.keys(catego)).length;          
            var type =(_.keys(catego));
            var no=(_.values(catego));
             //console.log(type);
             //console.log(no);
//LEGEND TOP RIGHT           
            legend.addTo(map);
            legend.update(divNo,type,no);
    });

map.addControl(geoList);

legend = L.control({position: 'topright'});

legend.onAdd = function (divNo,map,type) {
    this._div = L.DomUtil.create('div', 'info legend');
    this.update();
    return this._div;
};
legend.update = function (divNo,type,no) {
    for (var i = 0; i < divNo; i++) {
        this._div.innerHTML +='<div id="containerElement"></div>';
        for (var i = 0,j = 0; i < type.length ,j < no.length; i++,j++) {
            $('<div class="collapsible" id="section' + i + '" />').text(type[i]+' are: '+no[j].length).appendTo('#containerElement');
            $('<div class="container"><div class="content"><table cellpadding="0" cellspacing="0" border="0" class="display" ></table></div></div>').appendTo('#containerElement');
            //$('<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>').appendTo(".content");
//
                    table = $('table.display').dataTable( {
                     "paging": true,
                     "scrollY": "300px",
                     "scrollCollapse": true,
                     "bFilter":false,
                     "ordering": false,
                     "info":     false,
                     "bProcessing": true,
                     "aaData": no[j],
                        "aoColumns": [
                            { "mData": "properties.ProducerName" },
                            { "mData": "properties.ProducerID" }
                            ]
                    } );
//                    
        }
        $('.collapsible').collapsible({speed: 1000,bind: 'click'});    
    }
    
};
legend.addTo(map);

var svg = dimple.newSvg("#chartContainer", 750, 440);
var data = [
    { Sector: "Co-operative Societies", Recorded: 440 },
    { Sector: "Factories ", Recorded: 922 },
    { Sector: "Estate Producers", Recorded: 327 },
    { Sector: "Small Estates", Recorded: 563 }
];
var myChart = new dimple.chart(svg, data);
myChart.setBounds(120, 60, 600, 350)
var x = myChart.addCategoryAxis("x", "Sector");
var y = myChart.addMeasureAxis("y", "Recorded");
y.tickFormat = ',';
y.showGridlines = false;
y.hidden = true;
myChart.addColorAxis("Recorded",["red","#ededed","blue","#008000"]);
myChart.addSeries(null, dimple.plot.bar);
myChart.draw();        


    
$.fn.dataTable.ext.errMode = 'none';
