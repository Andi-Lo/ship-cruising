'use strict';

let turf = require('../libs/turf');
let leafletMap = require('./leafletMap');
let leaflet = require('leaflet');
let circleCoastForces = [];

/**
 * Draws a polyline in leaflet
 * @param featureCollection has to be a lineString collection
 * @param color
 * @param weight
 */
let drawPolyline = function(featureCollection, color = '#3388ff', weight = 3) {
  turf.meta.featureEach(featureCollection, function(feature) {
    let swappedCords = turf.flip(feature);
    let maps = leafletMap.getMaps();

    for(let i = 0; i < maps.length; i++) {
      leaflet.polyline(swappedCords.geometry.coordinates, {
        color: color,
        weight: weight
      }).addTo(maps[i]);
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

let drawPoints = function(featureCollection, radius = 5, hexColor = "#F23C00") {
  let maps = leafletMap.getMaps();

  turf.meta.featureEach(featureCollection, function(feature) {
    let coord = turf.invariant.getCoord(turf.flip(feature));
    // drawCircle(maps[0], coord, radius, hexColor);
    drawCircleMarker(maps[0], coord, radius, hexColor);
  });
};

let drawPointsCoastForces = function(featureCollection, radius = 5, hexColor = "#F23C00") {
  let maps = leafletMap.getMaps();
  // Make sure the old points get erased
  removeCoastCircles();

  turf.meta.featureEach(featureCollection, function(feature) {
    let coord = turf.invariant.getCoord(turf.flip(feature));
    // let circle = drawCircle(maps[0], coord, radius, hexColor);
    let circle = drawCircleMarker(maps[0], coord, radius, hexColor);
    circleCoastForces.push(circle);
  });
};

function removeCoastCircles() {
  let maps = leafletMap.getMaps();
  for(let i = 0; i < circleCoastForces.length; i++) {
    maps[0].removeLayer(circleCoastForces[i]);
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
