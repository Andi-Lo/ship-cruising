'use strict';

let turf = require('@turf/turf');
turf.meta = require('@turf/meta');
turf.invariant = require('@turf/invariant');
let options = require('../modules/options').force;
require("babel-polyfill");


/**
 * ES6 Generator iterates over the features of the featureCollection
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 * @param {any} featureCollection
 * @param {number} [start=0]
 * @param {any} [end=-1]
 * @returns a feature on success else false
 */
let iterateFeature = function* (fc, start = 0, end = -1) {
  if(end === -1) end = fc.features.length;

  for(start; start < end; start++) {
    yield fc.features[start];
  }

  if(start === end) return false;
};

let equidistant = function(fc, padding, toLineString = false) {
  let pointsOnLine = [];

  turf.meta.featureEach(fc, function(feature) {
    let dist = turf.lineDistance(feature);
    for(let i = 0; i < dist; i += padding) {
      pointsOnLine.push(turf.along(feature, i, 'kilometers'));
    }
  });
  fc = turf.featureCollection(pointsOnLine);
  if(toLineString) {
    fc = fcToLineString(fc);
  }
  return fc;
};

let equidistantPointsZoom = function(fc, metersPerPixel) {
  // Pixel space between the points
  let spaceBetweenPoints = (options.pixelSpaceForces * metersPerPixel) / 1000;
  return equidistant(fc, spaceBetweenPoints);
};

function fcToLineString(fc) {
  let lineString = [];
  for(let i = 0; i < fc.features.length; i++) {
    lineString.push(fc.features[i].geometry.coordinates);
  }
  lineString = turf.lineString(lineString);
  return lineString;
}

let multipolToLineString = function(fc) {
  let lineString = [];
  let unpacked = unpackMultiPolCoords(fc);
  unpacked.forEach((feature) => {
    lineString.push(turf.lineString(feature));
  });
  lineString = turf.featureCollection(lineString);
  return lineString;
};

let unpackMultiPolCoords = function(features) {
  let data = [];
  turf.meta.featureEach(features, function(feature) {
    let coordCollection = feature.geometry.coordinates;
    coordCollection.forEach(function(coords) {
      coords.forEach(function(coord) {
        data.push(coord);
      });
    });
  });
  return data;
};

module.exports = turf;
module.exports.iterateFeature = iterateFeature;
module.exports.equidistant = equidistant;
module.exports.equidistantPointsZoom = equidistantPointsZoom;
module.exports.unpackMultiPolCoords = unpackMultiPolCoords;
module.exports.multipolToLineString = multipolToLineString;
