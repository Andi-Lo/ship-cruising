'use strict';

let turf = require('../libs/turf');
let leafletMap = require('./leafletMap');
let leaflet = require('leaflet');
let circleCoastForces = [];

/**
 * Draws a polyline in leaflet
 * @param fc has to be a lineString collection
 * @param color
 * @param weight
 */
let drawPolyline = function(fc, color = '#3388ff', weight = 3) {
  let maps = leafletMap.getMap();

  turf.meta.featureEach(fc, function(feature) {
    let swappedCords = turf.flip(feature);

    leaflet.polyline(swappedCords.geometry.coordinates, {
      color: color,
      weight: weight
    }).addTo(maps);
  });
};

let drawMarkers = function(fc) {
  let maps = leafletMap.getMap();
  let coord;
  let marker;
  let text;

  turf.meta.featureEach(fc, function(feature) {
    coord = turf.invariant.getCoord(turf.flip(feature));
    marker = drawMarker(maps, coord);
    // using es6 template literals (` `) here
    text = `<b>${feature.properties.name}</b><br>
                ${coord[1]} "lat "  ${coord[0]}`;
    bindMarkerPopup(marker, text);
  });
};

let drawPoints = function(fc, radius = 5, hexColor = "#F23C00") {
  let maps = leafletMap.getMap();

  turf.meta.featureEach(fc, function(feature) {
    let coord = turf.invariant.getCoord(turf.flip(feature));
    drawCircleMarker(maps, coord, radius, hexColor);
  });
};

let drawPointsCoastForces = function(fc, radius = 5, hexColor = "#F23C00") {
  let maps = leafletMap.getMap();
  let circle;
  // Make sure the old points get erased
  removeCoastCircles();

  turf.meta.featureEach(fc, function(feature) {
    turf.meta.coordEach(feature, function(coord) {
      circle = drawCircleMarker(
        maps,
        [coord[1], coord[0]],
        radius,
        hexColor);
      circleCoastForces.push(circle);
    });
  });
};

function removeCoastCircles() {
  let maps = leafletMap.getMap();
  for(let i = 0; i < circleCoastForces.length; i++) {
    maps.removeLayer(circleCoastForces[i]);
  }
}

function drawMarker(map, coord) {
  return leaflet.marker(coord).addTo(map);
};

/* function drawCircle(map, coord, radius, hexColor) {
  return leaflet.circle(coord, {
    color: '#FFFFFF',
    fillColor: hexColor,
    radius: radius,
    fillOpacity: 1,
    stroke: false
  }).addTo(map);
}*/

function drawCircleMarker(map, coord, radius, hexColor) {
  return leaflet.circleMarker(coord, {
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

module.exports.drawPolyline = drawPolyline;
module.exports.drawMarkers = drawMarkers;
module.exports.drawPoints = drawPoints;
module.exports.drawPointsCoastForces = drawPointsCoastForces;
