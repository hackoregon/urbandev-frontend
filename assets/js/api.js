var startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
var endDate = moment().format('YYYY-MM-DD');

var dataDateRanges = {
  'permits': {min: '1995-01-03', max: '2015-06-30'},
  'crimes': {min: '2004-01-01', max: '2014-12-31'},
  'demolitions': {min: '2004-01-14', max: '2014-12-31'}
};

var pdxBounds = [[45.43628556252907, -122.83573150634764],[45.56358318479177,-122.50442504882814]];
var pdxBoundsString = '-122.83573150634764,45.43628556252907,-122.50442504882814,45.56358318479177';
var bounds = map.getBounds().toBBoxString();

// jQuery variables
var $yearStart = $('#yearstart');
var $yearEnd = $('#yearend');
var $loading = $("#loading");
var $nbSelect = $('#neighborhoodselect');

// this variable will hold the TAFFY list of neighborhoods
var nbhoodDb;

// $('#permits-checkbox').attr('title', dataDateRanges[0].permits.min + ' to ' + dataDateRanges[0].permits.max);
// $('#crimes-checkbox').attr('title', dataDateRanges[1].crimes.min + ' to ' + dataDateRanges[1].crimes.max);
// $('#demolitions-checkbox').attr('title', dataDateRanges[2].demolitions.min + ' to ' + dataDateRanges[2].demolitions.max);

// $('[data-toggle="tooltip"]').tooltip();


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
var nbhoodShapesUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/neighborhoods.geojson";

// Get neighborhood shape, add to map
var nbhoodLayer = new L.geoJson();

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
    var nbhoodTaffyList = [];
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
      nbhoodLayer.setStyle(nbhoodLayerStyle);
      nbhoodLayer.bringToBack();
    });
  })
  .fail(function() {
    console.log("Failed to fetch neighborhood shapes.");
  });
}

// get permits data
var permitsUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/permits.geojson";

// get demolitions data
var demolitionsUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/demolitions.geojson";

// Get crime data
// store in Taffy db
var crimeUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/crimes.json";

var timelineLayer = L.timeline(null, {
  formatDate: formatDate,
  pointToLayer: function(feature, latlng) {
    var marker = L.circleMarker(latlng, geojsonMarkerOptions);
    if (typeof feature.properties.issuedate !== 'undefined') {
      // console.log('not undefined');
      dataType = "Permit";
      var date = feature.properties.issuedate;
      var value = formatCurrency(feature.properties.value);
    } else {
      dataType = "Demolition";
      var date = feature.properties.demolition_date;
      var value = "NA";
    }
    var popupContent = "<br><strong>" + dataType + "</strong> "
                        + "<br><strong>Feature ID:</strong> "
                        + String(feature.properties.id) + "<hr>"
                        + "<strong>Address: </strong>"
                        + feature.properties.address
                        + "<br><strong>Units: </strong>"
                        + String(feature.properties.units)
                        + "<br><strong>Date: </strong>"
                        + String(date)
                        + "<br><strong>Size: </strong>"
                        + String(feature.properties.sqft) + " sqft"
                        + "<br><strong>Value: </strong>";
                        + String(value);

    marker.bindPopup(popupContent);
    return marker;
  },
  style: timelineLayerStyle
});

// Return marker data and add to the map using the leaflet timeline plugin
// works with permits and demolition data
function getPermits(start, end, neighborhood, type, dataType) {
  if (neighborhood == "all") {
    bounds = pdxBounds;
    neighborhood = '';
  } else {
    bounds = '';
  }
  if (dataType == "permits") {
    url = permitsUrl;
  } else {
    url = demolitionsUrl;
  }
  start = typeof start !== 'undefined' ? start : startDate;
  end = typeof end !== 'undefined' ? end : endDate;
  //bounds = typeof bounds !== 'undefined' ? bounds : map.getBounds().toBBoxString();
  type = typeof type !== 'undefined' ? type : "residential";
  return $.ajax({
    method: "GET",
    url: url,
    data: {
      type: type, //type: "residential",
      neighborhood: neighborhood,
      startdate: start, //moment().subtract(1, 'years').format('YYYY-MM-DD'), //"2014-10-04"
      enddate: end, //moment().format('YYYY-MM-DD') //"2015-10-04"
      bounds: bounds
    }
  })
  .done(function(data) {
    var permitsJson = data;
    // console.log(permitsJson);
    // permitsLayer.clearLayers();
    // map.removeControl(timelineLayer.timeSliderControl);
    // timelineLayer.clearLayers();
    $(permitsJson.features).each(function(key, data) {

      if (dataType == "permits") {
        var date = data.properties.issuedate;
      } else {
        var date = data.properties.demolition_date;
      }
      var propStartYear = date;//moment(date);//.get('year');
      var propEndYear = end;//moment(date).add(150, 'days');//.get('year');
      data.properties['start'] = propStartYear;
      data.properties['end'] = propEndYear;

    });
    // permitsLayer.addLayer(permitsLayer[key]);
    timelineLayer.addData(permitsJson);
    console.log(this.url);
    // permitsLayer.addTo(map);
  })
  .fail(function() {
    console.log("Failed to fetch permits json data");
  });
  // promises.push(promise);
}

function getCrimesYear(nbhood, yearRange) {
  var crimeCount = 0;
  var crimesByYear = {}; // need year to count mapping to sync count animation to timeline
  var crimesPromises = [];
  for (var i = 0; i < yearRange.length; i++) {
    var promise = $.ajax({
      method: "GET",
      url: crimeUrl,
      data: {
        query: "perNeighborhoodPerYear",
        year: yearRange[i],
        // hardcoding violent crime parameter for the time being:
        type: "violent"
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
      fillColor: getColor(crimeCount)
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

var hoodsShown = true;

// Utility functions

// formatting for marker values
function formatCurrency (num) {
  return "$" + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

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

function getYearFromDate(date) {
  return moment(date).year();
}

function zoomToNeighborhood(nbhoodVal) {
  timelineLayer.clearLayers();
  if (nbhoodVal == "all") {
    nbhoodLayer.clearLayers();
    map.fitBounds(pdxBounds);
  } else {
    var hoodBbxArray = nbhoodDb({name: nbhoodVal}).first().bbx;
    currentHoodBbx = (hoodBbxArray[0].concat(hoodBbxArray[1])).join(',');
    hoodBbxArray[0] = switchCoords(hoodBbxArray[0]);
    hoodBbxArray[1] = switchCoords(hoodBbxArray[1]);
    map.fitBounds(hoodBbxArray, {
      padding: [60, 90]
    });
    hoodBbxArray[0] = switchCoords(hoodBbxArray[0]);
    hoodBbxArray[1] = switchCoords(hoodBbxArray[1]);
    getNbhoodShape(nbhoodVal);
  }
}

function getEarliestYear(selectedData) {
  var minYears = [];
  for (var i = 0; i < selectedData.length; i++) {
    var typeOfData = selectedData[i];
    minYears.push(getYearFromDate(dataDateRanges[typeOfData].min));
  }
  return Math.max.apply(null, minYears);
}

// Bind or update dom elements once they're loaded
$(document).ready(function() {
  $('#permits-checkbox').after('<p class="date-range">(' + getYearFromDate(dataDateRanges.permits.min) + ' to ' + getYearFromDate(dataDateRanges.permits.max) + ')</p>');
  $('#crimes-checkbox').after('<p class="date-range">(' + getYearFromDate(dataDateRanges.crimes.min) + ' to ' + getYearFromDate(dataDateRanges.crimes.max) + ')</p>');
  $('#demolitions-checkbox').after('<p class="date-range">(' + getYearFromDate(dataDateRanges.demolitions.min) + ' to ' + getYearFromDate(dataDateRanges.demolitions.max) + ')</p>');

  // Initialize date range select boxes
  for (var i = 1995; i <= 2015; i++) {
    $yearStart.append('<option value="' + i + '">' + i + '</option>');
    $yearEnd.append('<option value="' + i + '">' + i + '</option>');
  }

  $('#toggle-hoods').on('click', toggleHoods);

  $('.form__data-types').on('change', function() {
    var formVars = [];
    $("#sidebar input:checked").each(function() {
      formVars.push($(this).val());
    });
    if (formVars.length > 0) {
      $yearStart.val(getEarliestYear(formVars));
      if (parseInt($yearEnd.val()) < getEarliestYear(formVars)) {
        $yearEnd.val(getEarliestYear(formVars));
      }
    }
  });

  $yearStart.on('change', function() {
    var minYear = $(this).val();
    if ($yearEnd.val() < minYear) {
      $yearEnd.val(minYear);
    }
  });

  $yearEnd.on('change', function() {
    var maxYear = $(this).val();
    if ($yearStart.val() > maxYear) {
      $yearStart.val(maxYear);
    }
  });

  $nbSelect.on('change', function() {
    var nbhoodVal = $(this).val();
    zoomToNeighborhood(nbhoodVal);
  });

  $('.time-text').on('change', function() {
    // console.log($(this).val());
  });

  $('#plot-submit').on('click', function(e) {
    e.preventDefault();
    $loading.show();
    timelineLayer.clearLayers();
    var nbhoodVal = $nbSelect.val();
    var yearStart = $yearStart.val();
    var yearEnd = $yearEnd.val();
    var formVars = [];

    delete timelineLayer.options.start;
    delete timelineLayer.options.end;
    delete timelineLayer.time;
    timelineLayer.times = [];
    timelineLayer.initialize(null, {
      // static data for testing counter update
      // counterData: {2011: 300, 2012: 368, 2013: 402, 2014: 20002},
      // counterId: 'average',
      formatDate: formatDate,
      pointToLayer: function(feature, latlng) {
        var marker = L.circleMarker(latlng, geojsonMarkerOptions);
        if (typeof feature.properties.issuedate !== 'undefined') {
          dataType = "Permit";
          var date = feature.properties.issuedate;
          var value = formatCurrency(feature.properties.value);
        } else {
          dataType = "Demolition";
          var date = feature.properties.demolition_date;
          var value = "NA";
        }
        var popupContent = "<br><strong>" + dataType + "</strong> "
                            + "<br><strong>Feature ID:</strong> "
                            + String(feature.properties.id) + "<hr>"
                            + "<strong>Address: </strong>"
                            + feature.properties.address
                            + "<br><strong>Units: </strong>"
                            + String(feature.properties.units)
                            + "<br><strong>Date: </strong>"
                            + String(date)
                            + "<br><strong>Size: </strong>"
                            + String(feature.properties.sqft) + " sqft"
                            + "<br><strong>Value: </strong>"
                            + String(value);

        marker.bindPopup(popupContent);
        return marker;
      },
      style: timelineLayerStyle
    });

    $("#sidebar input:checked").each(function() {
      formVars.push($(this).val());
    });
    for (var i = 0; i < formVars.length; i++) {
      switch (formVars[i]) {
        case "permits":
          // Restricting date selection to full year
          var needPermits = true;
          break;
        case "crimes":
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
        case "demolitions":
          var needDemolitions = true;
          break;

      }
    }

    // Should refactor this! Maybe attach a data attribute to each checkbox,
    // then iterate through those needing to be added to the animation and
    // call get permits for each of them, then apply 'then' callback
    if (needPermits && needDemolitions) {
      $.when(
        // if we need to make sure permits finishes before demolitions b/c of the date range,
        // can chain another "then" with the demolitions call; but we should instead constrain
        // the date selection to the data availability
        getPermits(yearStart + '-01-01', yearEnd + '-12-31', nbhoodVal, "residential", "permits"),
        getPermits(yearStart + '-01-01', yearEnd + '-12-31', nbhoodVal, "residential", "demolitions")
      ).then(function() {
        if (typeof timelineLayer.timeSliderControl != "undefined") {
          map.removeControl(timelineLayer.timeSliderControl);
          timelineLayer.timeSliderControl = L.Timeline.timeSliderControl(timelineLayer);
          timelineLayer.timeSliderControl.addTo(map);
        }
        timelineLayer.addTo(map);
        $loading.hide();
      });
    } else if (needPermits) {
      $.when(
        getPermits(yearStart + '-01-01', yearEnd + '-12-31', nbhoodVal, "residential", "permits")
      ).then(function() {
        if (typeof timelineLayer.timeSliderControl != "undefined") {
          map.removeControl(timelineLayer.timeSliderControl);
          timelineLayer.timeSliderControl = L.Timeline.timeSliderControl(timelineLayer);
          timelineLayer.timeSliderControl.addTo(map);
        }
        timelineLayer.addTo(map);
        $loading.hide();
      });
    } else if (needDemolitions) {
      $.when(
        getPermits(yearStart + '-01-01', yearEnd + '-12-31', nbhoodVal, "residential", "demolitions")
      ).then(function() {
        if (typeof timelineLayer.timeSliderControl != "undefined") {
          map.removeControl(timelineLayer.timeSliderControl);
          timelineLayer.timeSliderControl = L.Timeline.timeSliderControl(timelineLayer);
          timelineLayer.timeSliderControl.addTo(map);
        }
        timelineLayer.addTo(map);
        $loading.hide();
      });
    }

  });

  // Initialize select box with neighborhoods
  getNbhoodList();

});

