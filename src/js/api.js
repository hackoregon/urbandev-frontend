var startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
var endDate = moment().format('YYYY-MM-DD');

var dataDateRanges = {
  'permits': {min: '1995-01-03', max: '2015-06-30'},
  'crimes': {min: '2004-01-01', max: '2014-12-31'},
  'demolitions': {min: '2004-01-14', max: '2014-12-31'}
};

var pdxBounds = [[45.43628556252907, -122.83573150634764],[45.56358318479177,-122.50442504882814]];
var bounds = map.getBounds().toBBoxString();

// jQuery variables
var $yearStart = $('#yearstart');
var $yearEnd = $('#yearend');
var $loading = $("#loading");
var $nbSelect = $('#neighborhoodselect');

// these variable will hold TAFFY lists
var nbhoodDb,
  crimesDb;

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
         name: nbhoodListJson.rows[i][0],
         bbx: nbhoodListJson.rows[i][1]
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

var timelineLayer = L.timeline(null, timelineConfig);

// Return marker data and add to the map using the leaflet timeline plugin
// works with permits and demolition data
function getPermits(start, end, neighborhood, type, dataType) {
  var url;
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
  start += '-01-01';
  end = typeof end !== 'undefined' ? end : endDate;
  end += '-12-31';
  //bounds = typeof bounds !== 'undefined' ? bounds : map.getBounds().toBBoxString();
  type = typeof type !== 'undefined' ? type : "residential";
  return $.ajax({
    method: "GET",
    url: url,
    data: {
      type: type, //type: "residential",
      neighborhood: neighborhood,
      startdate: start, //moment().subtract(1, 'years').format('YYYY-MM-DD'),
                        // //"2014-10-04"
      enddate: end, //moment().format('YYYY-MM-DD') //"2015-10-04"
      bounds: bounds
    }
  })
  .done(function(data) {
    var permitsJson = data;
    var date;
    // console.log(permitsJson);
    // permitsLayer.clearLayers();
    // map.removeControl(timelineLayer.timeSliderControl);
    // timelineLayer.clearLayers();
    $(permitsJson.features).each(function(key, data) {

      if (dataType == "permits") {
        date = data.properties.issuedate;
      } else {
        date = data.properties.demolition_date;
      }
      var propStartYear = date;//moment(date);//.get('year');
      var propEndYear = end;//moment(date).add(150, 'days');//.get('year');
      data.properties.start = propStartYear;
      data.properties.end = propEndYear;

    });
    // permitsLayer.addLayer(permitsLayer[key]);
    timelineLayer.addData(permitsJson);
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
  var fetchCrimesFailed = function() {
    console.log("Failed to fetch crimes.");
  };
  var fetchCrimesSucceeded = function(data) {
    var crimesJson = data;
    var crimesTaffyList = [];
    var crimesInNbhood = 0;
    for (var j = 0; j < (crimesJson.rows).length; j++) {
      var rec = {
        year: yearRange[i],
        name: crimesJson.rows[j][0],
        num: crimesJson.rows[j][1]
      };
      crimesTaffyList.push(rec);

      if (crimesJson.rows[j][0] == nbhood) {
        crimesInNbhood += crimesJson.rows[j][1];
      }

    }
    if (typeof crimesDb == "undefined") {
      crimesDb = TAFFY(crimesTaffyList);
    } else {
      crimesDb.insert(crimesTaffyList);
    }
    crimeCount += crimesInNbhood;
    //$('#crimetotal').append(crimesInNbhood + '<br>');

  };
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
    .done(fetchCrimesSucceeded)
    .fail(fetchCrimesFailed);
    crimesPromises.push(promise);
  }

  $.when.apply($, crimesPromises).done(function() {
    $('#crimetotal').append(crimeCount);
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

function updateTimelineLayer() {
  if (typeof timelineLayer.timeSliderControl != "undefined") {
    map.removeControl(timelineLayer.timeSliderControl);
    timelineLayer.timeSliderControl = L.Timeline.timeSliderControl(timelineLayer);
    timelineLayer.timeSliderControl.addTo(map);
  }
  timelineLayer.addTo(map);
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

  $(document).on("ajaxStart", function () {
    $loading.show();
  });

  $(document).on("ajaxStop", function () {
    $loading.hide();
  });

  $('#plot-submit').on('click', function(e) {
    e.preventDefault();
    timelineLayer.clearLayers();
    var nbhoodVal = $nbSelect.val();
    var yearStart = $yearStart.val();
    var yearEnd = $yearEnd.val();
    var formVars = [];

    delete timelineLayer.options.start;
    delete timelineLayer.options.end;
    delete timelineLayer.time;
    timelineLayer.times = [];
    timelineLayer.initialize(null, timelineConfig);

    $("#sidebar input:checked").each(function() {
      formVars.push($(this).val());
    });
    var needPermits = false;
    var needDemolitions = false;
    for (var i = 0; i < formVars.length; i++) {
      switch (formVars[i]) {
        case "permits":
          // Restricting date selection to full year
          needPermits = true;
          break;
        case "crimes":
          if (parseInt(yearStart) < 2004) {
            yearStart = "2004";
          }
          var yearRange = yearsInRange(yearStart, yearEnd);
          if (yearRange.length === 0) {
            console.log('Year range is zero!');
          }
          $('#crimetotal').html('');
          getCrimesYear(nbhoodVal, yearRange);
          break;
        case "demolitions":
          needDemolitions = true;
          break;

      }
    }

    // Should refactor this! Maybe attach a data attribute to each checkbox,
    // then iterate through those needing to be added to the animation and
    // call get permits for each of them, then apply 'then' callback
    if (needPermits && needDemolitions) {
      $.when(
        // if we need to make sure permits finishes before demolitions b/c of the date
        // range, can chain another "then" with the demolitions call; but we should
        // instead constrain the date selection to the data availability
        getPermits(yearStart, yearEnd, nbhoodVal, "residential", "permits"),
        getPermits(yearStart, yearEnd, nbhoodVal, "residential", "demolitions")
      ).then(updateTimelineLayer);
    } else if (needPermits) {
      $.when(
        getPermits(yearStart, yearEnd, nbhoodVal, "residential", "permits")
      ).then(updateTimelineLayer);
    } else if (needDemolitions) {
      $.when(
        getPermits(yearStart, yearEnd, nbhoodVal, "residential", "demolitions")
      ).then(updateTimelineLayer);
    }

  });

  // Initialize select box with neighborhoods
  getNbhoodList();

});
