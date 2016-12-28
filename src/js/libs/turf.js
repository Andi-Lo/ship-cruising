'use strict';

let turf = require('@turf/turf');
turf.meta = require('@turf/meta');
turf.invariant = require('@turf/invariant');
turf.size = require('turf-size');
let options = require('../modules/options').force;
let polygon2line = require('./to-lineString');
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

/**
 * Takes a featureCollection of type LineString and fixes
 * the start and end point of the route by resetting those
 * points to their initial waypoint value. This should close gaps
 * between the subsection of two routes.
 *
 * @param {any} featureCollection of type LineString
 * @returns featureCollection
 */
let fixRoute = function(fc) {
  turf.meta.featureEach(fc, function(feature) {
    let length = feature.geometry.coordinates.length;
    if(feature.properties.start && feature.properties.end) {
      // there have to be at least 2 points for this to make sense
      if(length > 0) {
        feature.geometry.coordinates[0] = feature.properties.start;
        feature.geometry.coordinates[length-1] = feature.properties.end;
      }
    }
    else {
      let first = feature.geometry.coordinates[0];
      let last = feature.geometry.coordinates[length-1];
      if(first[0] !== last[0] || first[1] !== last[1]) {
        feature.geometry.coordinates.push(first);
      }
    }
  });
  return fc;
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


/**
 * Takes a set of points and a set of polygons and returns
 * the points that fall within the polygons.
 * This function is a modified version of the official turf.within function
 *
 * @param {Array<Points>} points
 * @param {FeatureCollection<Polygon>} polygons
 * @returns FeatureCollection<LineString> with matching points
 */
let within = function(points, polygons) {
  let pointsWithin = [];
  for (let i = 0; i < polygons.features.length; i++) {
    for (let j = 0; j < points.length; j++) {
      let isInside = turf.inside(points[j], polygons.features[i]);
      if (isInside) {
        pointsWithin.push(points[j]);
      }
    }
  }
  if(pointsWithin.length > 0) {
    return turf.lineString(pointsWithin);
  }
  else {
    return false;
  }
};

function clip(feature, polygon) {
  let points = turf.meta.coordAll(feature);
  let isWithin = within(points, polygon);
  return isWithin;
};

let bboxClip = function(fc, bbox = defaults.bbox, bboxSize = 1) {
  // expand the bbox size by factor n
  bbox = turf.size(bbox, bboxSize);
  let polygon = turf.featureCollection([turf.bboxPolygon(bbox)]);
  fc = polygon2line(fc);

  let pointsWithin = turf.featureCollection([]);
  let intersection;
  turf.meta.featureEach(fc, function(feature) {
    intersection = clip(feature, polygon);
    if(intersection !== false) {
      pointsWithin.features.push(intersection);
    }
  });
  return pointsWithin;
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

module.exports = turf;
module.exports.bboxClip = bboxClip;
module.exports.clipPolygon = clipPolygon;
module.exports.within = within;
module.exports.iterateFeature = iterateFeature;
module.exports.equidistant = equidistant;
module.exports.fixRoute = fixRoute;
module.exports.fixLineString = fixLineString;
module.exports.equidistantPointsZoom = equidistantPointsZoom;
module.exports.unpackMultiPolCoords = unpackMultiPolCoords;
module.exports.multipolToLineString = multipolToLineString;
module.exports.fcToLineString = fcToLineString;
