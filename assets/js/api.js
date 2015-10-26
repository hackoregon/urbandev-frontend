(function() {


  var startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');

  var dataDateRanges = {
    'permits': {min: '1995-01-03', max: '2015-06-30'},
    'crimes': {min: '2004-01-01', max: '2014-12-31'},
    'demolitions': {min: '2004-01-14', max: '2014-12-31'}
  };

  var pdxBounds = [[45.43628556252907, -122.83573150634764],[45.56358318479177,-122.50442504882814]];
  var pdxBoundsString = '-122.83573150634764,45.43628556252907,-122.50442504882814,45.56358318479177';

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
  var demolitionsUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/demolitions.geojson";
  var permitsLayer = new L.geoJson();
  var timelineLayer = L.timeline(null, {
    formatDate: function(date) {
      return moment(date).format("YYYY");
    },
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
    style: function(data) {
      //return markerStyle(data);
        var year = parseInt(data.properties['start']);//.get('year'));
        // console.log(data.properties.issuedate);
        if (typeof data.properties.issuedate !== 'undefined') {
          // console.log('not undefined');
          dataType = "permits";
          var color = getPermitColor(2015);//getPermitColor(year);
        } else {
          dataType = "demolitions";
          var color = getDemolitionsColor(2015);//getDemolitionsColor(year);
        }

        return {
          radius: 8,
          fillColor: color,//getPermitColor(year, dataType),//'#FF5500',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7
        };
      },
  });

  var bounds = map.getBounds().toBBoxString();

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

  // Get crime data
  // store in Taffy db
  var crimeUrl = "http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/crimes.json";

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



  var hoodsShown = true;

  // Utility functions

  // formatting for marker values
  function formatCurrency (num) {
    return "$" + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  function markerStyle(data) {
    // console.log(data);
    var year = parseInt(data.properties['start'].get('year'));
    return {
      radius: 8,
      fillColor: getPermitColor(year),//'#FF5500',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7
    };
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

  function getPermitColor(year) {
    return year >= 2015 ? '#E65100' :
           year > 2014 ? '#DB4D00' :
           year > 2013 ? '#EF6C00' :
           year > 2012 ? '#FF7300' :
           year > 2011 ? '#F57C00' :
           year > 2010 ? '#FF850A' :
           year > 2009 ? '#FB8C00' :
           year > 2008 ? '#FF930F' :
           year > 2007 ? '#FF9800' :
           year > 2006 ? '#FFA114' :
           year > 2005 ? '#FFA726' :
           year > 2004 ? '#FFAD33' :
           year > 2003 ? '#FFB442' :
           year > 2002 ? '#FFBA52' :
           year > 2001 ? '#FFC061' :
           year > 2000 ? '#FFC46B' :
           year > 1999 ? '#FFC875' :
           year > 1998 ? '#FFCC80' :
           year > 1997 ? '#FFD08A' :
           year > 1996 ? '#FFD494' :
           year >= 1995 ? '#FFD89E':
                       '#FFD89E';
  }

  function getDemolitionsColor(year) {
    return year >= 2015 ? '#4A148C' :
           year > 2014 ? '#6A1B9A' :
           year > 2013 ? '#7B1FA2' :
           year > 2012 ? '#8E24AA' :
           year > 2011 ? '#9C27B0' :
           year > 2010 ? '#AB47BC' :
           year > 2009 ? '#BA68C8' :
           year > 2008 ? '#CE93D8' :
           year > 2007 ? '#E1BEE7' :
           year > 2006 ? '#E9CFED' :
           year > 2005 ? '#EEDAF1' :
           year >= 2004 ? '#F3E5F5' :
                       '#F3E5F5';
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
      $('#yearstart').append('<option value="' + i + '">' + i + '</option>');
      $('#yearend').append('<option value="' + i + '">' + i + '</option>');
    }

    $('#toggle-hoods').on('click', toggleHoods);

    $('.form__data-types').on('change', function() {
      var formVars = [];
      $("#sidebar input:checked").each(function() {
        formVars.push($(this).val());
      });
      if (formVars.length > 0) {
        $('#yearstart').val(getEarliestYear(formVars));
        if (parseInt($('#yearend').val()) < getEarliestYear(formVars)) {
          $('#yearend').val(getEarliestYear(formVars));
        }
      }
    });

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
      zoomToNeighborhood(nbhoodVal);
    });

    $('.time-text').on('change', function() {
      // console.log($(this).val());
    });

    $('#plot-submit').on('click', function(e) {
      e.preventDefault();
      $("#loading").show();
      timelineLayer.clearLayers();
      var nbhoodVal = $('#neighborhoodselect').val();
      var yearStart = $('#yearstart').val();
      var yearEnd = $('#yearend').val();
      var formVars = [];

      delete timelineLayer.options.start;
      delete timelineLayer.options.end;
      delete timelineLayer.time;
      timelineLayer.times = Array();
      timelineLayer.initialize(null, {
        // static data for testing counter update
        // counterData: {2011: 300, 2012: 368, 2013: 402, 2014: 20002},
        // counterId: 'average',
        formatDate: function(date) {
          return moment(date).format("YYYY");
        },
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
        style: function(data) {
          //return markerStyle(data);
            var year = parseInt(data.properties['start']);//.get('year'));
            // console.log(data.properties.issuedate);
            if (typeof data.properties.issuedate !== 'undefined') {
              // console.log('not undefined');
              dataType = "permits";
              var color = getPermitColor(2015);//getPermitColor(year);
            } else {
              dataType = "demolitions";
              var color = getDemolitionsColor(2015);//getDemolitionsColor(year);
            }

            return {
              radius: 8,
              fillColor: color,//getPermitColor(year, dataType),//'#FF5500',
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.7
            };
          },
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
            map.removeControl(timelineLayer.timeSliderControl)
            timelineLayer.timeSliderControl = L.Timeline.timeSliderControl(timelineLayer);
            timelineLayer.timeSliderControl.addTo(map);
          }
          timelineLayer.addTo(map);
          $("#loading").hide();
        });
      } else if (needPermits) {
        $.when(
          getPermits(yearStart + '-01-01', yearEnd + '-12-31', nbhoodVal, "residential", "permits")
        ).then(function() {
          if (typeof timelineLayer.timeSliderControl != "undefined") {
            map.removeControl(timelineLayer.timeSliderControl)
            timelineLayer.timeSliderControl = L.Timeline.timeSliderControl(timelineLayer);
            timelineLayer.timeSliderControl.addTo(map);
          }
          timelineLayer.addTo(map);
          $("#loading").hide();
        });
      } else if (needDemolitions) {
        $.when(
          getPermits(yearStart + '-01-01', yearEnd + '-12-31', nbhoodVal, "residential", "demolitions")
        ).then(function() {
          if (typeof timelineLayer.timeSliderControl != "undefined") {
            map.removeControl(timelineLayer.timeSliderControl)
            timelineLayer.timeSliderControl = L.Timeline.timeSliderControl(timelineLayer);
            timelineLayer.timeSliderControl.addTo(map);
          }
          timelineLayer.addTo(map);
          $("#loading").hide();
        });
      }

    });

    // Initialize select box with neighborhoods
    getNbhoodList();

  });

})();
