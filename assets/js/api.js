(function() {

  var startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');

  // $('#input--daterange').daterangepicker({
  //   startDate: moment().subtract(1, 'years'),
  //   endDate: moment()
  // })
  // .on('apply.daterangepicker', function(ev, picker) {
  //   startDate = picker.startDate.format('YYYY-MM-DD');
  //   endDate = picker.endDate.format('YYYY-MM-DD');
  //   getPermits(startDate, endDate, map.getBounds().toBBoxString());
  // });

  // Get neighborhoods list and bounding box coordinates
  // store in Taffy db
  var nbhoodListUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/neighborhoods.json";
  function getNbhoodList() {
    $.ajax({
  	  method: "GET",
  	  url: nbhoodListUrl,
  	  data: {
        type: "residential",
        query: "listWithBBX",
        city: "portland"
  	  }
  	})
    .done(function(data) {
  	  var nbhoodListJson = data;

      $nbSelect = $('#neighborhoodselect');
      nbhoodTaffyList = [];
      for (var i = 0; i < (nbhoodListJson.rows).length; i++) {
        var nbhoodName = nbhoodListJson.rows[i][0];
        $nbSelect.append('<option value="' + nbhoodName + '">' + nbhoodName + '</option>');
        var rec = {
           name: nbhoodListJson['rows'][i][0],
           bbx: nbhoodListJson['rows'][i][1]
        };
        nbhoodTaffyList.push(rec);
      }
      nbhoodDb = TAFFY(nbhoodTaffyList);
    })
    .fail(function() {
      console.log("Failed to fetch neighborhood list.");
    });
  }
  getNbhoodList();

  // Get neighborhood shape, add to map
  var nbhoodLayer = new L.geoJson();
  function style(feature) {
    return {
      fillColor: '#3CE646',
      fillOpacity: 0.8,
      weight: 1,
      opacity: 0.8,
      color: '#3CE646'
    };
  }
  var nbhoodShapesUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/neighborhoods.geojson";
  function getNbhoodShape(nbhood) {
    $.ajax({
  	  method: "GET",
  	  url: nbhoodShapesUrl,
  	  data: {
        city: "portland",
        name: nbhood
  	  }
  	})
    .done(function(data) {
  	  var nbhoodShapesJson = data;
      nbhoodLayer.clearLayers();
  	  nbhoodLayer.addTo(map);
  	  $(nbhoodShapesJson.features).each(function(key, data) {
        nbhoodLayer.addData(data);
        nbhoodLayer.setStyle(style);
        nbhoodLayer.bringToBack();
      });
    })
    .fail(function() {
      console.log("Failed to fetch neighborhood shapes.");
    });
  }

  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: '#FF5500',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 1
  };
  var permitsUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/permits.geojson";
  var permitsLayer = new L.geoJson();
	var bounds = map.getBounds().toBBoxString();
  function getPermits(start, end, bounds, type) {
    start = typeof start !== 'undefined' ? start : startDate;
    end = typeof end !== 'undefined' ? end : endDate;
    bounds = typeof bounds !== 'undefined' ? bounds : map.getBounds().toBBoxString();
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
      permitsLayer.clearLayers();
  	  permitsLayer.addTo(map);
  	  $(permitsJson.features).each(function(key, data) {

        L.geoJson(data, {
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
          }
        }).addTo(map);

      });

    })
    .fail(function() {
      console.log("Failed to fetch permits json data");
    });
  }

  // Initialize date ranges
  for (var i = 1995; i <= 2015; i++) {
    $('#yearstart').append('<option value="' + i + '">' + i + '</option>');
    $('#yearend').append('<option value="' + i + '">' + i + '</option>');
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

  function switchCoords(coordArray) {
    var temp = coordArray[1];
    coordArray[1] = coordArray[0];
    coordArray[0] = temp;
    return coordArray;
  }

  $('#toggle-hoods').on('click', toggleHoods);

  $('#neighborhoodselect').on('change', function() {
    var nbhoodVal = $(this).val();
  });

  $('#plot-submit').on('click', function() {
    var nbhoodVal = $('#neighborhoodselect').val();
    var hoodBbxArray = nbhoodDb({name: nbhoodVal}).first().bbx;
    var yearStart = $('#yearstart').val();
    var yearEnd = $('#yearend').val();

    currentHoodBbx = (hoodBbxArray[0].concat(hoodBbxArray[1])).join(',');

    hoodBbxArray[0] = switchCoords(hoodBbxArray[0]);
    hoodBbxArray[1] = switchCoords(hoodBbxArray[1]);

    map.fitBounds(hoodBbxArray, {
      padding: [50, 80]
    });
    // temp workaround for "WTF, the nbhoodDb bbx arrays are getting switched vals too???"
    hoodBbxArray[0] = switchCoords(hoodBbxArray[0]);
    hoodBbxArray[1] = switchCoords(hoodBbxArray[1]);
    getNbhoodShape(nbhoodVal);
    // Restricting to date selection to full year
    getPermits(yearStart + '-01-01', yearEnd + '-12-31', currentHoodBbx, "residential");
  });

})();
