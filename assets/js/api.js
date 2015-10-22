(function() {

  var startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');

  var dataDateRanges = [
    {permits: {min: '1995-01-03', max: '2015-06-30'}},
    {crimes: {min: '2004-01-01', max: '2014-12-31'}},
    {demolitions: {min: '2004-01-14', max: '2014-12-31'}}
  ];

  $('#permits-checkbox').attr('title', dataDateRanges[0].permits.min + ' to ' + dataDateRanges[0].permits.max);
  $('#crimes-checkbox').attr('title', dataDateRanges[1].crimes.min + ' to ' + dataDateRanges[1].crimes.max);

  $('[data-toggle="tooltip"]').tooltip();

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


  // formatting for marker values
  function formatCurrency (num) {
    return "$" + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

  // Create permits markers
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
  var timelineLayer = L.timeline;
  var bounds = map.getBounds().toBBoxString();
  function getPermits(start, end, neighborhood, type) {
    start = typeof start !== 'undefined' ? start : startDate;
    end = typeof end !== 'undefined' ? end : endDate;
    //bounds = typeof bounds !== 'undefined' ? bounds : map.getBounds().toBBoxString();
    type = typeof type !== 'undefined' ? type : "residential";
    $.ajax({
  	  method: "GET",
  	  url: permitsUrl,
  	  data: {
  	    type: type, //type: "residential",
  	    neighborhood: neighborhood,
        startdate: start, //moment().subtract(1, 'years').format('YYYY-MM-DD'), //"2014-10-04"
        enddate: end //moment().format('YYYY-MM-DD') //"2015-10-04"
  	  }
  	})
  	.done(function(data) {
  	  var permitsJson = data;
      permitsLayer.clearLayers();
      // timelineLayer.clearLayers();
      map.removeLayer(timelineLayer);
  	  $(permitsJson.features).each(function(key, data) {
        // console.log(key);
        // console.log(data);
        var date = data.properties.issuedate;
        var propStartYear = moment(date);//.get('year');
        var propEndYear = end;//moment(date).add(150, 'days');//.get('year');
        //console.log(propStartYear);
        data.properties['start'] = propStartYear;
        data.properties['end'] = propEndYear;
        //console.log(data);
        // timelineLayer[key] = L.timeline(data, {
        //   formatDate: function(date) {
        //     return moment(date).format("YYYY");
        //   },
        //   pointToLayer: function(data, latlng) {
        //     var marker = L.circleMarker(latlng, geojsonMarkerOptions);
        //     var popupContent = "<strong>PERMIT DATA</strong> "
        //                         + "<br><strong>Feature ID:</strong> "
        //                         + String(feature.properties.id) + "<hr>"
        //                         + "<strong>Address: </strong>"
        //                         + feature.properties.address
        //                         + "<br><strong>Units: </strong>"
        //                         + String(feature.properties.units)
        //                         + "<br><strong>Issue Date: </strong>"
        //                         + String(feature.properties.issuedate)
        //                         + "<br><strong>Size: </strong>"
        //                         + String(feature.properties.sqft) + " sqft"
        //                         + "<br><strong>Value: </strong>"
        //                         + formatCurrency(feature.properties.value);
        //
        //     marker.bindPopup(popupContent);
        //     return marker;
        //   }
        // });
        //console.log(timeline);
        permitsLayer[key] = L.geoJson(data, {
          // formatDate: function(date) {
          //   return moment(date).format("YYYY");
          // },
          pointToLayer: function(feature, latlng) {
            var marker = L.circleMarker(latlng, geojsonMarkerOptions);
            var popupContent = "<strong>PERMIT DATA</strong> "
                                + "<br><strong>Feature ID:</strong> "
                                + String(feature.properties.id) + "<hr>"
                                + "<strong>Address: </strong>"
                                + feature.properties.address
                                + "<br><strong>Units: </strong>"
                                + String(feature.properties.units)
                                + "<br><strong>Issue Date: </strong>"
                                + String(feature.properties.issuedate)
                                + "<br><strong>Size: </strong>"
                                + String(feature.properties.sqft) + " sqft"
                                + "<br><strong>Value: </strong>"
                                + formatCurrency(feature.properties.value);

            marker.bindPopup(popupContent);
            return marker;
          }

        });

        // timelineLayer.addLayer(timelineLayer[key])
        permitsLayer.addLayer(permitsLayer[key]);
      });
      // console.log(permitsJson);
      timelineLayer = L.timeline(permitsJson, {
        style: function(data) {
          var year = parseInt(data.properties['start'].get('year'));
          // console.log(year);
          // console.log(year == 1995);
          // console.log(getPermitColor(year));
          return {
            radius: 8,
            fillColor: getPermitColor(year),//'#FF5500',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
          };
        },
        formatDate: function(date) {
          return moment(date).format("YYYY");
        },
        pointToLayer: function(feature, latlng) {
          var marker = L.circleMarker(latlng, geojsonMarkerOptions);
          var popupContent = "<strong>PERMIT DATA</strong> "
                              + "<br><strong>Feature ID:</strong> "
                              + String(feature.properties.id) + "<hr>"
                              + "<strong>Address: </strong>"
                              + feature.properties.address
                              + "<br><strong>Units: </strong>"
                              + String(feature.properties.units)
                              + "<br><strong>Issue Date: </strong>"
                              + String(feature.properties.issuedate)
                              + "<br><strong>Size: </strong>"
                              + String(feature.properties.sqft) + " sqft"
                              + "<br><strong>Value: </strong>"
                              + formatCurrency(feature.properties.value);

          marker.bindPopup(popupContent);
          return marker;
        }
      });
      timelineLayer.addTo(map);
      // timline.on('change', function(e) {
      //
      // })
      // timeline.addTo(map);
      // timeline.on('change', function(e) {
      //   updateList(e.target);
      // });
      // updateList(timeline);
      //permitsLayer.addTo(map);
    })
    .fail(function() {
      console.log("Failed to fetch permits json data");
    });
  }

  // Get crime data
  // store in Taffy db
  var crimeUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/crimes.json";

  function getCrimesYear(nbhood, yearRange) {
    var crimeCount = 0;
    var crimesPromises = [];
    for (var i = 0; i < yearRange.length; i++) {
      var promise = $.ajax({
    	  method: "GET",
    	  url: crimeUrl,
    	  data: {
          query: "perNeighborhoodPerYear",
          year: yearRange[i]
    	  }
    	})
      .done(function(data) {

    	  var crimesJson = data;
        crimesTaffyList = [];
        var crimesInNbhood = 0;
        for (var j = 0; j < (crimesJson.rows).length; j++) {
          var rec = {
            year: yearRange[i],
            name: crimesJson['rows'][j][0],
            num: crimesJson['rows'][j][1]
          };
          crimesTaffyList.push(rec);

          if (crimesJson['rows'][j][0] == nbhood) {
            crimesInNbhood += crimesJson['rows'][j][1];
          }

        }
        if (typeof crimesDb == "undefined") {
          crimesDb = TAFFY(crimesTaffyList);
        } else {
          crimesDb.insert(crimesTaffyList);
        }
        crimeCount += crimesInNbhood;
        //$('#crimetotal').append(crimesInNbhood + '<br>');

      })
      .fail(function() {
        console.log("Failed to fetch crimes.");
      });
      crimesPromises.push(promise);
    }

    $.when.apply($, crimesPromises).done(function() {
      $('#crimetotal').append(crimeCount);
      nbhoodLayer.setStyle({
        fillColor: getColor(crimeCount),
      });
    }).fail(function() {
      console.log('Failed to finish iterating over crime.');
    });

  }

  // function getTotalCrimes(nbhood, yearRange) {
  //   var crimeCount = 0;
  //   for (var i = 0; i < yearRange.length; i++) {
  //     getCrimesYear(nbhood, yearRange[i]);
  //     crimeCount += getCrimesYear(nbhood, yearRange[i]);
  //   }
  //   return crimeCount;
  // }

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

  function yearsInRange(startStr, endStr) {
    var startInt = parseInt(startStr);
    var endInt = parseInt(endStr);
    var yearsArray = [];
    for (var i = startInt; i <= endInt; i++) {
      yearsArray.push(i);
    }
    return yearsArray;
  }

  $('#toggle-hoods').on('click', toggleHoods);

  $('#yearstart').on('change', function() {
    var minYear = $(this).val();
    if ($('#yearend').val() < minYear) {
      $('#yearend').val(minYear);
    }
  });

  $('#yearend').on('change', function() {
    var maxYear = $(this).val();
    if ($('#yearstart').val() > maxYear) {
      $('#yearstart').val(maxYear);
    }
  });

  $('#neighborhoodselect').on('change', function() {
    var nbhoodVal = $(this).val();
  });

  function getPermitColor(d) {
    return d >= 2015 ? '#000' :
           d > 2014 ? '#0d0d0d' :
           d > 2013 ? '#1d1d1d' :
           d > 2012 ? '#111' :
           d > 2011 ? '#2d2d2d' :
           d > 2010 ? '#222' :
           d > 2009 ? '#3d3d3d' :
           d > 2008 ? '#333' :
           d > 2007 ? '#4d4d4d' :
           d > 2006 ? '#444' :
           d > 2005 ? '#5d5d5d' :
           d > 2004 ? '#555' :
           d > 2003 ? '#666' :
           d > 2002 ? '#777' :
           d > 2001 ? '#888' :
           d > 2000 ? '#999' :
           d > 1999 ? '#aaa' :
           d > 1998 ? '#bbb' :
           d > 1997 ? '#ccc' :
           d > 1996 ? '#ddd' :
           d >= 1995 ? '#eee':
                       '#fff';
  }

  function getColor(d) {
    return d > 1000 ? '#3CE646' :
           d > 500  ? '#63EB6B' :
           d > 250  ? '#76ED7D' :
           d > 200  ? '#9DF2A2' :
           d > 150   ? '#B1F5B5' :
           d > 100   ? '#C4F7C7' :
           d > 50   ? '#D8FADA' :
                      '#EBFCEC';
  }

  $('#plot-submit').on('click', function(e) {
    e.preventDefault();
    var nbhoodVal = $('#neighborhoodselect').val();
    var hoodBbxArray = nbhoodDb({name: nbhoodVal}).first().bbx;
    var yearStart = $('#yearstart').val();
    var yearEnd = $('#yearend').val();
    var formVars = [];
    $("#sidebar input:checked").each(function() {
      formVars.push($(this).val());
    });

    currentHoodBbx = (hoodBbxArray[0].concat(hoodBbxArray[1])).join(',');

    for (var i = 0; i < formVars.length; i++) {
      switch (formVars[i]) {
        case "permits":
          // Restricting to date selection to full year
          getPermits(yearStart + '-01-01', yearEnd + '-12-31', nbhoodVal, "residential");
          break;
        case "crime":
          if (parseInt(yearStart) < 2004) {
            yearStart = "2004";
          }
          var yearRange = yearsInRange(yearStart, yearEnd);
          if (yearRange.length == 0) {
            console.log('Year range is zero!');
          }
          $('#crimetotal').html('');
          getCrimesYear(nbhoodVal, yearRange);
          break;

      }
    }

    hoodBbxArray[0] = switchCoords(hoodBbxArray[0]);
    hoodBbxArray[1] = switchCoords(hoodBbxArray[1]);

    map.fitBounds(hoodBbxArray, {
      padding: [60, 90]
    });
    // temp workaround for "WTF, the nbhoodDb bbx arrays are getting switched vals too???"
    hoodBbxArray[0] = switchCoords(hoodBbxArray[0]);
    hoodBbxArray[1] = switchCoords(hoodBbxArray[1]);
    getNbhoodShape(nbhoodVal);

  });

})();
