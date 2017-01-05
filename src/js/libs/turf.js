'use strict';

let turf = require('@turf/turf');
turf.meta = require('@turf/meta');
turf.invariant = require('@turf/invariant');
turf.size = require('turf-size');
let options = require('../modules/options').force;
let lineclip = require('lineclip');
require("babel-polyfill");

/**
 * ES6 Generator iterates over the features of the featureCollection
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 * @param {any} featureCollection
 * @param {number} [start=0]
 * @param {number} [end=-1]
 * @returns a feature on success else undefined
 */
let iterateFeature = function* (fc, start = 0, end = -1) {
  if(start < 0) {
    throw new Error('Start can not be negative');
  }
  if(start === end) {
    throw new Error('start value can not equal end');
  }
  if(end === -1) end = fc.features.length;

  for(start; start < end; start++) {
    yield fc.features[start];
  }
};

let fixLineString = function(fc) {
  turf.meta.featureEach(fc, function(feature) {
    let length = feature.geometry.coordinates.length;
    let first = feature.geometry.coordinates[0];
    let last = feature.geometry.coordinates[length-1];
    if(first[0] !== last[0] || first[1] !== last[1]) {
      feature.geometry.coordinates.push(first);
    }
  });
  return fc;
};

function equdistantParameters(feature, stepSize) {
  if (stepSize < 0) {
    throw new Error('StepSize can not be negative');
  }
  let dist = turf.lineDistance(feature);
  // make sure we are not dividing by zero
  let steps = (stepSize === 0) ? dist : Math.floor(dist / stepSize);
  if( steps === 0) {
    steps = 1;
  }
  // this calculates a more exact step size value
  let delta = Math.floor(dist - (steps * stepSize));
  stepSize += delta / steps;
  return {stepSize, steps};
};

let equidistant = function(fc, stepSize) {
  let features = [];
  let i = 0;

  turf.meta.featureEach(fc, function(feature) {
    let pOnLine = [];
    let param = equdistantParameters(feature, stepSize);
    for(let j = 0; j <= param.steps; j++) {
      let p = turf.along(feature, param.stepSize * j, 'kilometers');
      pOnLine.push(p.geometry.coordinates);
    }
    features.push(turf.lineString(pOnLine));
    features[i].properties = fc.features[i].properties;
    i++;
  });
  return turf.featureCollection(features);
};

let equidistantPointsZoom = function(fc, metersPerPixel) {
  let spaceBetweenPoints = (options.pixelSpaceForces * metersPerPixel) / 1000;
  return equidistant(fc, spaceBetweenPoints);
};

let fcToLineString = function(fc) {
  let lineString = [];
  for(let i = 0; i < fc.features.length; i++) {
    lineString.push(fc.features[i].geometry.coordinates);
  }
  lineString = turf.lineString(lineString);
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

let fcToFcPoints = function(fc) {
  let points = [];
  turf.meta.coordEach(fc, function(coord) {
    points.push(turf.point(coord));
  });
  return turf.featureCollection(points);
};

let isInside = function(fcMap, fcRoute) {
  fcMap = fixLineString(fcMap);
  let features = [];
  let points = [];
  turf.meta.featureEach(fcMap, function(feature) {
    points = turf.meta.coordAll(feature);
    if(points.length > 3) {
      features.push(turf.polygon([points]));
    }
  });
  fcMap = turf.featureCollection(features);
  turf.meta.featureEach(fcMap, function(mapFeature) {
    turf.meta.featureEach(fcRoute, function(routeFeature) {
      if(turf.inside(routeFeature, mapFeature)) {
        routeFeature.properties.isInsideLand = true;
      }
    });
  });
  return fcRoute;
};

let clipPolygon = function(fc, bbox) {
  let points;
  let polygon;
  bbox = turf.size(bbox, 1);
  let clipped = turf.featureCollection([]);
  turf.meta.featureEach(fc, function(feature) {
    points = turf.meta.coordAll(feature);
    polygon = lineclip.polygon(points, bbox);
    if(polygon.length > 0) {
      clipped.features.push(turf.lineString(polygon));
    }
  });
  clipped = turf.fixLineString(clipped);
  return clipped;
};

/**
 * @param {featureCollection} Feature or FeatureCollection
 * @returns rectangular polygon feature that encompasses all vertices
 */
let calcBbox = function(route) {
  let feature = turf.envelope(route);
  return turf.bbox(feature);
};

module.exports = turf;
module.exports.calcBbox = calcBbox;
module.exports.clipPolygon = clipPolygon;
module.exports.iterateFeature = iterateFeature;
module.exports.equidistant = equidistant;
module.exports.fixLineString = fixLineString;
module.exports.fcToFcPoints = fcToFcPoints;
module.exports.equidistantPointsZoom = equidistantPointsZoom;
module.exports.unpackMultiPolCoords = unpackMultiPolCoords;
module.exports.fcToLineString = fcToLineString;
module.exports.isInside = isInside;
