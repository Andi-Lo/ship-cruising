'use strict';

let turf = require('../libs/turf');
let leafletMap = require('./leafletMap');
let leaflet = require('leaflet');

let drawPolyline = function(featureCollection) {
  turf.meta.featureEach(featureCollection, function(feature) {
    let swappedCords = turf.flip(feature);
    let maps = leafletMap.getMaps();

    for(let i = 0; i < maps.length; i++) {
      leaflet.polyline(swappedCords.geometry.coordinates, {color: 'red'})
             .addTo(maps[i]);
    }
  });
};

let drawMarkers = function(featureCollection) {
  let maps = leafletMap.getMaps();

  turf.meta.featureEach(featureCollection, function(feature) {
    let coord = turf.invariant.getCoord(turf.flip(feature));
    let marker = drawMarker(maps[0], coord);
    // using es6 template literals (` `) here
    let text = `<b>${feature.properties.name}</b><br>
                ${coord[1]} "lat "  ${coord[0]}`;
    bindMarkerPopup(marker, text);
  });
};

let drawPoints = function(featureCollection, radius = 5) {
  let maps = leafletMap.getMaps();

  turf.meta.featureEach(featureCollection, function(feature) {
    let coord = turf.invariant.getCoord(turf.flip(feature));
    drawCircle(maps[0], coord, radius);
  });
};

function drawMarker(map, coord) {
  return leaflet.marker(coord).addTo(map);
};

function drawCircle(map, coord, radius) {
  leaflet.circle(coord, radius).addTo(map);
}

function bindMarkerPopup(marker, text) {
  marker.bindPopup(text);
};

module.exports.drawPolyline = drawPolyline;
module.exports.drawMarkers = drawMarkers;
module.exports.drawPoints = drawPoints;
