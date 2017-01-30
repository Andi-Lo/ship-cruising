'use strict';

let turf = require('@turf/turf');
turf.meta = require('@turf/meta');
turf.invariant = require('@turf/invariant');
turf.size = require('turf-size');
let selectPolygons = require('../libs/whichPolygon');
require("babel-polyfill");

/**
 * ES6 Generator iterates over the features of the featureCollection
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 * @param {FeatureColelction<LineString>}
 * @param {number} [start = 0]
 * @param {number} [end = -1]
 * @throws {Error} when start value is negative
 * @throws {Error} when start and end value are equal
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

/**
 * If start and endpoint are unequal, add the start
 * point to the array so the lineString behaves like a closed
 * polygon which needs to have start === endpoint
 *
 * @param {FeatureCollection<LineString>}
 * @throws {Error} on wrong geometry type
 * @returns {FeatureCollection<LineString>}
 */
let fixLineString = function(fc) {
  turf.meta.featureEach(fc, function(feature) {
    if(feature.geometry.type === 'LineString') {
      let length = feature.geometry.coordinates.length;
      if(length > 0) {
        let first = feature.geometry.coordinates[0];
        let last = feature.geometry.coordinates[length-1];
        if(first[0] !== last[0] || first[1] !== last[1]) {
          feature.geometry.coordinates.push(first);
        }
      }
    }
    else
      throw new Error(`Wrong geometry.type given: ${feature.geometry.type}`);
  });
  return fc;
};

/**
 * Calculates the stepsize and the amount of steps needed returns an object
 * containing those.
 *
 * @param {Feature<LineString>} a lineString feature
 * @param {number} the desired stepSize
 * @returns {Object} containing stepsize and number of steps
 */
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

/**
 * Distributes each route point equidistantly along the route
 * in the given stepSize
 *
 * @param {FeatureCollection<LineString>}
 * @param {number} stepSize
 * @returns {FeatureCollection<LineString>}
 */
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

/**
 * Converts a FeatureCollection<Point> into a LineString feature
 *
 * @param {FeatureCollection<Point>}
 * @returns {Feature<LineString>}
 */
let fcToLineString = function(fc) {
  let lineString = [];
  for(let i = 0; i < fc.features.length; i++) {
    lineString.push(fc.features[i].geometry.coordinates);
  }
  lineString = turf.lineString(lineString);
  return lineString;
};


/**
 * Get the polygons that lay inside or getting touched by a bounding box.
 *
 * @typedef {[number, number, number, number]} Bbox
 * @param {FeatureCollection<(Polygon|MultiPolygon)>} FeatureCollection with Polygons
 * @param {Bbox} bbox which encloses the desired polygons you want to get
 * @returns {FeatureCollection<(Polygon|MultiPolygon)>}
 */
let getPolygons = function(fc, bbox) {
  let savedFeatures = [];
  turf.meta.featureEach(fc, function(feature) {
    let coords = feature.geometry.coordinates;
    let coordsList = [];
    if (feature.geometry.type === 'Polygon') {
      coordsList.push(coords);
    }
    else if (feature.geometry.type === 'MultiPolygon') {
      for (let j = 0; j < coords.length; j++) {
        coordsList.push(coords[j]);
      }
    }
    // select polygons that lay inside bbox
    for(let i = 0; i < coordsList.length; i++) {
      if(selectPolygons(coordsList[i], bbox)) {
        savedFeatures.push(feature);
        break;
      }
    }
  });

  return turf.featureCollection(savedFeatures);
};

/**
 * Calculates the minimal bbox for a given set of Features
 *
 * @example e.g. the function will give the minimal bounding box for the route
 * @typedef {[number, number, number, number]} Bbox
 * @param {Feature|FeatureCollection} fc Feature or FeatureCollection
 * @returns {Bbox} rectangular bbox that encompasses all vertices
 */
let calcBbox = function(fc) {
  let feature = turf.envelope(fc);
  return turf.bbox(feature);
};

module.exports = turf;
module.exports.calcBbox = calcBbox;
module.exports.iterateFeature = iterateFeature;
module.exports.equidistant = equidistant;
module.exports.fixLineString = fixLineString;
module.exports.fcToLineString = fcToLineString;
module.exports.getPolygons = getPolygons;
