/**
 * Created by Tree on 3/12/16.
 */
function nbhoodLayerStyle() {
  return {
    fillColor: '#3CE646',
    fillOpacity: 0.8,
    weight: 1,
    opacity: 0.8,
    color: '#3CE646'
  };
}

// marker styles
var geojsonMarkerOptions = {
  radius: 8,
  fillColor: '#FF5500',
  color: '#000',
  weight: 1,
  opacity: 1,
  fillOpacity: 1
};

// TODO: remove hard-coding of the year

function timelineLayerStyle(data) {
      var year = parseInt(data.properties['start']);//.get('year'));
      // console.log(data.properties.issuedate);
      var color;
      if (typeof data.properties.issuedate !== 'undefined') {
        // console.log('not undefined');
        dataType = "permits";
        color = getPermitColor(2015);//getPermitColor(year);
      } else {
        dataType = "demolitions";
        color = getDemolitionsColor(2015);//getDemolitionsColor(year);
      }

      return {
        radius: 8,
        fillColor: color,//getPermitColor(year, dataType),//'#FF5500',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      };
    }

