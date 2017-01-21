'use strict';

let turf = require('../libs/turf');
let leafletMap = require('./leafletMap');
let L = require('leaflet');
let defaults = require('../modules/options').defaults;

/**
 * Draws a polyline in L
 * @param fc has to be a lineString collection
 * @param color
 * @param weight
 */
let drawPolyline = function(fc, color = defaults.routeColor, weight = 2) {
  let maps = leafletMap.getMap();

  turf.meta.featureEach(fc, function(feature) {
    let swappedCords = turf.flip(feature);

    L.polyline(swappedCords.geometry.coordinates, {
      color: color,
      weight: weight
    }).addTo(maps);
  });
};

let drawMarkers = function(fc) {
  let map = leafletMap.getMap();
  let coord;
  let marker;
  let text;
  let i = 1;

  turf.meta.featureEach(fc, function(feature) {
    coord = turf.invariant.getCoord(turf.flip(feature));
    marker = L.marker(coord, {
      icon:	new L.NumberedDivIcon({number: i})
    }).addTo(map);
    text = `<b>${feature.properties.name}</b><br>
                ${coord[1]} "lat "  ${coord[0]}`;
    bindMarkerPopup(marker, text);
    i++;
  });
};

let drawPoints = function(fc, radius = 5, hexColor = "#F23C00") {
  let maps = leafletMap.getMap();

  turf.meta.featureEach(fc, function(feature) {
    let coord = turf.invariant.getCoord(turf.flip(feature));
    drawCircleMarker(maps, coord, radius, hexColor);
  });
};

function drawCircleMarker(map, coord, radius, hexColor) {
  return L.circleMarker(coord, {
    color: '#FFFFFF',
    fillColor: hexColor,
    radius: radius,
    fillOpacity: 1,
    stroke: false
  }).addTo(map);
}

function bindMarkerPopup(marker, text) {
  marker.bindPopup(text);
};

L.NumberedDivIcon = L.Icon.extend({
  options: {
    iconUrl: 'images/marker_hole.png',
    number: '',
    shadowUrl: null,
    iconSize: new L.Point(25, 41),
    iconAnchor: new L.Point(13, 41),
    popupAnchor: new L.Point(0, -33),
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		*/
    className: 'L-div-icon'
  },

  createIcon: function() {
    let div = document.createElement('div');
    let img = this._createImg(this.options['iconUrl']);
    let numdiv = document.createElement('div');
    numdiv.setAttribute( "class", "number" );
    numdiv.innerHTML = this.options['number'] || '';
    div.appendChild( img );
    div.appendChild( numdiv );
    this._setIconStyles(div, 'icon');
    return div;
  },

	// you could change this to add a shadow like in the normal marker if you really wanted
  createShadow: function() {
    return null;
  }
});

module.exports.drawPolyline = drawPolyline;
module.exports.drawMarkers = drawMarkers;
module.exports.drawPoints = drawPoints;
