(function() {

  var startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');

  $('#input--daterange').daterangepicker({
    startDate: moment().subtract(1, 'years'),
    endDate: moment()
  })
  .on('apply.daterangepicker', function(ev, picker) {
    startDate = picker.startDate.format('YYYY-MM-DD');
    endDate = picker.endDate.format('YYYY-MM-DD');
    getPermits(startDate, endDate, map.getBounds().toBBoxString());
  });

  var nbhoodUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/neighborhoods?get";
  var nbhoodLayer = new L.geoJson();
  function style(feature) {
    return {
      fillColor: '#c8c8c8',
      fillOpacity: 0.6,
      weight: 1,
      opacity: 0.8,
      color: '#777'
    };
  }
  function getNbhood() {
    $.ajax({
  	  method: "GET",
  	  url: nbhoodUrl,
  	  data: {

  	  }
  	})
    .done(function(data) {
  	  var nbhoodJson = data;
      //nbhoodLayer.clearLayers();
  	  nbhoodLayer.addTo(map);
      //console.log(nbhoodJson);
  	  $(nbhoodJson.features).each(function(key, data) {
        nbhoodLayer.addData(data);
      });
    })
    .fail(function() {
      console.log("Failed to fetch neighborhood json data");
    });
  }

  var permitsUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/permits";
  var permitsLayer = new L.geoJson();
	var bounds = map.getBounds().toBBoxString();
  function getPermits(start, end, bounds, type) {
    start = typeof start !== 'undefined' ? start : startDate;
    end = typeof end !== 'undefined' ? end : endDate;
    bounds = typeof bounds !== 'undefined' ? bounds : map.getBounds().toBBoxString();
    //console.log(bounds);
    type = typeof type !== 'undefined' ? type : "residential";
    $.ajax({
  	  method: "GET",
  	  url: permitsUrl,
  	  data: {
  	    type: type, //type: "residential",
  	    bounds: bounds,
        startdate: start, //moment().subtract(1, 'years').format('YYYY-MM-DD'), //"2014-10-04"
        enddate: end //moment().format('YYYY-MM-DD') //"2015-10-04"
  	  }
  	})
  	.done(function(data) {
  	  var permitsJson = data;
      // map.removeLayer(permitsLayer);
  	  // var permitsLayer = new L.geoJson();
      permitsLayer.clearLayers();
  	  permitsLayer.addTo(map);
      //console.log(permitsJson);
  	  $(permitsJson.features).each(function(key, data) {

        // console.log(key);
        // console.log(data);
        // console.log(permitsJson.features[key].properties);
        // console.log(this);
        // if (this.properties && this.properties.address) {
        //   permitsLayer.bindPopup(this.properties.address);
        // }
        // if (permitsJson.features[key].properties && permitsJson.features[key].properties.address) {
        //   permitsLayer.bindPopup(permitsJson.features[key].properties.address);
        // }
        permitsLayer.addData(data);
      });
      //console.log(this.url);
    })
    .fail(function() {
      console.log("Failed to fetch permits json data");
    });
  }

  var hoodsShown = true;

  function toggleHoods() {
    if (hoodsShown) {
      map.removeLayer(hoods);
    } else {
      map.addLayer(hoods);
    }
    hoodsShown = !hoodsShown;
  }

  $('#toggle-hoods').on('click', toggleHoods);
  map.on('viewreset dragend', function(e) {
    getPermits();
  });
  getNbhood();

})();
