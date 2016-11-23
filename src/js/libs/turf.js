let turf = require('@turf/turf');
turf.meta = require('@turf/meta');
turf.invariant = require('@turf/invariant');
let _ = require('lodash/array');


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

let equidistantLineString = function(fc) {
  let pointOnLine = [];

  turf.meta.featureEach(fc, function(feature) {
    let length = feature.geometry.coordinates.length;
    let dist = turf.lineDistance(feature);
    let steps = Math.floor(dist / length);
    // idea: calculate a dynamic step size, depending on the total line distance
    dist = dist + steps;
    let i = 0;

    while(i < dist) {
      pointOnLine.push(turf.along(feature, i, 'kilometers'));
      i += steps/2;
    }
  });
  fc = turf.featureCollection(pointOnLine);
  lineString = toLineStringCollection(fc);

  return lineString;
};

function toLineStringCollection(fc) {
  let lineString = [];
  for(let i = 0; i < fc.features.length; i++) {
    lineString.push(fc.features[i].geometry.coordinates);
  }
  lineString = turf.lineString(lineString);
  return lineString;
}

module.exports = turf;
module.exports.iterateFeature = iterateFeature;
module.exports.equidistantLineString = equidistantLineString;
