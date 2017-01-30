'use strict';

let _ = {};
_.round = require('lodash/math').round;
let turf = require('../libs/turf');
let leafletMap = require('./leafletMap');
let L = require('leaflet');
let defaults = require('../modules/options').defaults;

/**
 * Draws a polyline in Leaflet
 *
 * @param {FeatureCollection<LineString>} fc
 * @param {string} color in rgba
 * @param {number} [lineWeight = 3] of the stroke. Higher values means thicker lines
 */
let drawPolyline = function(fc, color = defaults.routeColor, lineWeight = 3) {
  let maps = leafletMap.getMap();

  turf.meta.featureEach(fc, function(feature) {
    let swappedCords = turf.flip(feature);

    L.polyline(swappedCords.geometry.coordinates, {
      color: color,
      weight: lineWeight
    }).addTo(maps);
  });
};

/**
 * Checks if the given route is a round trip and sets its property to true or false.
 *
 * @param {FeatureCollection<LineString>} fc
 * @returns {true|false} true on round trip else false
 */
function isRoundTrip(fc) {
  let first = fc.features[0].geometry.coordinates;
  let last = fc.features[fc.features.length-1].geometry.coordinates;

  // -80.1712 should match with -80.171292
  let round = ((arr) => {
    return [_.round(arr[0], 3), _.round(arr[1], 3)];
  });
  first = round(first);
  last = round(last);

  if(first[0] === last[0] && first[1] === last[1]) {
    fc.features[0].properties.isFirst = true;
    fc.features[fc.features.length-1].properties.isLast = true;
    return true;
  }
  return false;
}

/**
 * Draw markers on Leaflet Map
 *
 * @param {FeatureCollection<LineString>} fc
 */
let drawMarkers = function(fc) {
  let map = leafletMap.getMap();
  let coord;
  let marker;
  let text;
  let i = 1;
  let cssClass = '';
  let roundTrip = isRoundTrip(fc);

  turf.meta.featureEach(fc, function(feature) {
    cssClass = 'L-div-icon';
    if(roundTrip) {
       // If true we have to rotate the markers a bit so the marker numbers don't overlap each other.
      if(feature.properties.isFirst === true)
        cssClass += ' rotate-left';
      if(feature.properties.isLast === true)
        cssClass += ' rotate-right';
    }
    coord = turf.invariant.getCoord(turf.flip(feature));
    marker = L.marker(coord, {
      icon:	new L.NumberedDivIcon({number: i, className: cssClass})
    }).addTo(map);
    text = `<b>${feature.properties.name}</b><br>
                ${coord[1]}, ${coord[0]}`;
    bindMarkerPopup(marker, text);
    i++;
  });
};

/**
 * Bind an onclick event onto markers. You could use this to show harbour names on markers etc.
 * You need to provide this in your harbour data as property "name"
 *
 * @see text = feature.properties.name; in the code above.
 * @param {Marker} marker an leaflet marker object
 * @param {string} text to get displayed on the marker in leaflet
 */
function bindMarkerPopup(marker, text) {
  marker.bindPopup(text);
};

// extending a leaflet marker here
// http://leafletjs.com/examples/custom-icons/
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
