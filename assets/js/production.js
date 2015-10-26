var map, featureList, boroughSearch = [], theaterSearch = [], museumSearch = [];

// $(window).resize(function() {
//   sizeLayerControl();
// });

// $(document).on("click", ".feature-row", function(e) {
//   $(document).off("mouseout", ".feature-row", clearHighlight);
//   sidebarClick(parseInt($(this).attr("id"), 10));
// });

// $(document).on("mouseover", ".feature-row", function(e) {
//   highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
// });
//
// $(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#stories-btn").click(function() {
  $("#storiesModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

// function sizeLayerControl() {
//   $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
// }

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  //map.setView([45.5, -122.67], 12);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through theaters layer and add only features which are in the map bounds */
  // theaters.eachLayer(function (layer) {
  //   if (map.hasLayer(theaterLayer)) {
  //     if (map.getBounds().contains(layer.getLatLng())) {
  //       $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
  //     }
  //   }
  // });
  /* Loop through museums layer and add only features which are in the map bounds */
  // museums.eachLayer(function (layer) {
  //   if (map.hasLayer(museumLayer)) {
  //     if (map.getBounds().contains(layer.getLatLng())) {
  //       $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
  //     }
  //   }
  // });
  /* Update list.js featureList */
  // featureList = new List("features", {
  //   valueNames: ["feature-name"]
  // });
  // featureList.sort("feature-name", {
  //   order: "asc"
  // });
}

/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var stamenToner = L.tileLayer("http://stamen-tiles.a.ssl.fastly.net/Toner/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
      fill: false,
      opacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    boroughSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Boroughs",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/boroughs.geojson", function (data) {
  boroughs.addData(data);
});

var subwayLines = L.geoJson(null, {
  style: function (feature) {
    if (feature.properties.route_id === "1" || feature.properties.route_id === "2" || feature.properties.route_id === "3") {
      return {
        color: "#ff3135",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "4" || feature.properties.route_id === "5" || feature.properties.route_id === "6") {
      return {
        color: "#009b2e",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "7") {
      return {
        color: "#ce06cb",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "A" || feature.properties.route_id === "C" || feature.properties.route_id === "E" || feature.properties.route_id === "SI" || feature.properties.route_id === "H") {
      return {
        color: "#fd9a00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "Air") {
      return {
        color: "#ffff00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "B" || feature.properties.route_id === "D" || feature.properties.route_id === "F" || feature.properties.route_id === "M") {
      return {
        color: "#ffff00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "G") {
      return {
        color: "#9ace00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "FS" || feature.properties.route_id === "GS") {
      return {
        color: "#6e6e6e",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "J" || feature.properties.route_id === "Z") {
      return {
        color: "#976900",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "L") {
      return {
        color: "#969696",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "N" || feature.properties.route_id === "Q" || feature.properties.route_id === "R") {
      return {
        color: "#ffff00",
        weight: 3,
        opacity: 1
      };
    }
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        subwayLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("data/subways.geojson", function (data) {
  subwayLines.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var theaterLayer = L.geoJson(null);
var theaters = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/theater.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    // if (feature.properties) {
    //   var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
    //   layer.on({
    //     click: function (e) {
    //       $("#feature-title").html(feature.properties.NAME);
    //       $("#feature-info").html(content);
    //       $("#featureModal").modal("show");
    //       highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
    //     }
    //   });
    //   $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    //   theaterSearch.push({
    //     name: layer.feature.properties.NAME,
    //     address: layer.feature.properties.ADDRESS1,
    //     source: "Theaters",
    //     id: L.stamp(layer),
    //     lat: layer.feature.geometry.coordinates[1],
    //     lng: layer.feature.geometry.coordinates[0]
    //   });
    //}
  }
});
$.getJSON("data/DOITT_THEATER_01_13SEPT2010.geojson", function (data) {
  theaters.addData(data);
  map.addLayer(theaterLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
var museumLayer = L.geoJson(null);
var museums = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/museum.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    // if (feature.properties) {
    //   var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
    //   layer.on({
    //     click: function (e) {
    //       $("#feature-title").html(feature.properties.NAME);
    //       $("#feature-info").html(content);
    //       $("#featureModal").modal("show");
    //       highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
    //     }
    //   });
    //   $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    //   museumSearch.push({
    //     name: layer.feature.properties.NAME,
    //     address: layer.feature.properties.ADRESS1,
    //     source: "Museums",
    //     id: L.stamp(layer),
    //     lat: layer.feature.geometry.coordinates[1],
    //     lng: layer.feature.geometry.coordinates[0]
    //   });
    // }
  }
});
$.getJSON("data/DOITT_MUSEUM_01_13SEPT2010.geojson", function (data) {
  museums.addData(data);
});

map = L.map("map", {
  zoom: 12,
  center: [45.5, -122.67],
  layers: [mapquestOSM, boroughs, markerClusters, highlight, stamenToner],
  zoomControl: false,
  attributionControl: false
});
//console.log('map set');



/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === theaterLayer) {
    markerClusters.addLayer(theaters);
    syncSidebar();
  }
  if (e.layer === museumLayer) {
    markerClusters.addLayer(museums);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === theaterLayer) {
    markerClusters.removeLayer(theaters);
    syncSidebar();
  }
  if (e.layer === museumLayer) {
    markerClusters.removeLayer(museums);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'><a href='http://hackoregon.org'>Hack Oregon</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "topleft"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "topleft",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": mapquestOSM,
  "Aerial Imagery": mapquestOAM,
  "Imagery with Streets": mapquestHYB,
  "Toner": stamenToner
};

var groupedOverlays = {
  // "Points of Interest": {
  //   "<img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters": theaterLayer,
  //   "<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums": museumLayer
  // },
  // "Toggle": {
  //   "Hide Overlays": boroughs,
  //   "Subway Lines": subwayLines
  // }
};

// control box
var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed,
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  //sizeLayerControl();
  /* Fit map to boroughs bounds */
  //map.fitBounds(boroughs.getBounds());
  //featureList = new List("features", {valueNames: ["feature-name"]});
  //featureList.sort("feature-name", {order:"asc"});

  var boroughsBH = new Bloodhound({
    name: "Boroughs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boroughSearch,
    limit: 10
  });

  var theatersBH = new Bloodhound({
    name: "Theaters",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: theaterSearch,
    limit: 10
  });

  var museumsBH = new Bloodhound({
    name: "Museums",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: museumSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  boroughsBH.initialize();
  theatersBH.initialize();
  museumsBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Boroughs",
    displayKey: "name",
    source: boroughsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Boroughs</h4>"
    }
  }, {
    name: "Theaters",
    displayKey: "name",
    source: theatersBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Museums",
    displayKey: "name",
    source: museumsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Boroughs") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Theaters") {
      if (!map.hasLayer(theaterLayer)) {
        map.addLayer(theaterLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      //map.setView([45.5, -122.67], 12);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Museums") {
      if (!map.hasLayer(museumLayer)) {
        map.addLayer(museumLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      //map.setView([45.5, -122.67], 12);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
      //map.setView([45.5, -122.67], 12);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}


// Dashboard Widget Toggle
//

$(document).ready(function() {
            $('[rel=tooltip]').tooltip();
            if (document.body.clientWidth <= 767) {
                $('#sidebar').toggle();
                $('a.toggle i').toggleClass('fa fa-chevron-left fa fa-chevron-right');
            };
        });


        $('a.toggle').click(function() {
            $('a.toggle i').toggleClass('fa fa-chevron-right fa fa-chevron-left');
            $('#map').toggleClass('#sidebar');
            $('#sidebar').toggle();
            map.invalidateSize();

            return false;

        });


// End Dashboard Widget Toggle


// Carousel Height Transition Customization
$(document).ready(function () {
    $('.carousel').carousel({
        interval: 8500,
        pause: "hover"
    }).on('slide.bs.carousel', function (e) {
        var nextH = $(e.relatedTarget).height();
        $(this).find('.active').parent().animate({ height: nextH }, 600);
    });

});
// End Carousel Customization

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
          var color = getPermitColor(year);
        } else {
          dataType = "demolitions";
          var color = getDemolitionsColor(year);
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
    $('#permits-checkbox').after('<span class="date-range">(' + getYearFromDate(dataDateRanges.permits.min) + ' to ' + getYearFromDate(dataDateRanges.permits.max) + ')</span>');
    $('#crimes-checkbox').after('<span class="date-range">(' + getYearFromDate(dataDateRanges.crimes.min) + ' to ' + getYearFromDate(dataDateRanges.crimes.max) + ')</span>');
    $('#demolitions-checkbox').after('<span class="date-range">(' + getYearFromDate(dataDateRanges.demolitions.min) + ' to ' + getYearFromDate(dataDateRanges.demolitions.max) + ')</span>');

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
              var color = getPermitColor(year);
            } else {
              dataType = "demolitions";
              var color = getDemolitionsColor(year);
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
