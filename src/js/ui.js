// layer styles
function nbhoodLayerStyle () {
  return {
    fillColor: '#3CE646',
    fillOpacity: 0.8,
    weight: 1,
    opacity: 0.8,
    color: '#3CE646'
  };
}

// TODO: remove hard-coding of the year from timeline layer
function timelineLayerStyle (data) {
  var color;
  if (typeof data.properties.issuedate !== 'undefined') {
    color = getPermitColor (2015);
  } else {
    color = getDemolitionsColor (2015);
  }

  return {
    radius: 8,
    fillColor: color,
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7
  };
}

var timelineConfig = {
  formatDate: formatDate,
  pointToLayer: pointToLayer,
  style: timelineLayerStyle
};

// marker styles
var geojsonMarkerOptions = {
  radius: 8,
  fillColor: '#FF5500',
  color: '#000',
  weight: 1,
  opacity: 1,
  fillOpacity: 1
};

function getPermitColor (year) {
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
                                          year >= 1995 ? '#FFD89E' :
                                            '#FFD89E';
}

function getDemolitionsColor (year) {
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

function getColor (d) {
  return d > 1000 ? '#3CE646' :
    d > 500 ? '#63EB6B' :
      d > 250 ? '#76ED7D' :
        d > 200 ? '#9DF2A2' :
          d > 150 ? '#B1F5B5' :
            d > 100 ? '#C4F7C7' :
              d > 50 ? '#D8FADA' :
                '#EBFCEC';
}


// utility functions

var hoodsShown = true;

function toggleHoods () {
  if (hoodsShown) {
    map.removeLayer (hoods);
  } else {
    map.addLayer (hoods);
  }
  hoodsShown = !hoodsShown;
}

function switchCoords (coordArray) {
  var temp = coordArray[1];
  coordArray[1] = coordArray[0];
  coordArray[0] = temp;
  return coordArray;
}

function yearsInRange (startStr, endStr) {
  var startInt = parseInt (startStr);
  var endInt = parseInt (endStr);
  var yearsArray = [];
  for (var i = startInt; i <= endInt; i++) {
    yearsArray.push (i);
  }
  return yearsArray;
}

function getYearFromDate (date) {
  return moment (date).year ();
}

function zoomToNeighborhood (nbhoodVal) {
  timelineLayer.clearLayers ();
  if (nbhoodVal == "all") {
    nbhoodLayer.clearLayers ();
    map.fitBounds (pdxBounds);
  } else {
    var hoodBbxArray = nbhoodDb ({name: nbhoodVal}).first ().bbx;
    hoodBbxArray[0] = switchCoords (hoodBbxArray[0]);
    hoodBbxArray[1] = switchCoords (hoodBbxArray[1]);
    map.fitBounds (hoodBbxArray, {
      padding: [60, 90]
    });
    hoodBbxArray[0] = switchCoords (hoodBbxArray[0]);
    hoodBbxArray[1] = switchCoords (hoodBbxArray[1]);
    getNbhoodShape (nbhoodVal);
  }
}

function getEarliestYear (selectedData) {
  var minYears = [];
  for (var i = 0; i < selectedData.length; i++) {
    var typeOfData = selectedData[i];
    minYears.push (getYearFromDate (dataDateRanges[typeOfData].min));
  }
  return Math.max.apply (null, minYears);
}

function formatDate (date) {
  return moment (date).format ("YYYY");
}

// formatting for marker values
function formatCurrency (num) {
  return "$" + num.toFixed (0).replace (/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function pointToLayer (feature, latlng) {
  var marker = L.circleMarker (latlng, geojsonMarkerOptions);
  var dataType, date, value;

  if (typeof feature.properties.issuedate !== 'undefined') {
    // console.log('not undefined');
    dataType = "Permit";
    date = feature.properties.issuedate;
    value = formatCurrency (feature.properties.value);
  } else {
    dataType = "Demolition";
    date = feature.properties.demolition_date;
    value = "NA";
  }
  var popupContent = "<br><strong>" + dataType + "</strong> " +
    "<br><strong>Feature ID:</strong> " +
    String (feature.properties.id) + "<hr>" +
    "<strong>Address: </strong>" +
    feature.properties.address +
    "<br><strong>Units: </strong>" +
    String (feature.properties.units) +
    "<br><strong>Date: </strong>" +
    String (date) +
    "<br><strong>Size: </strong>" +
    String (feature.properties.sqft) +
    " sqft" +
    "<br><strong>Value: </strong>" +
    String (value);

  marker.bindPopup (popupContent);
  return marker;
}
