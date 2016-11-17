let turf = require('@turf/turf');
turf.meta = require('@turf/meta');
turf.invariant = require('@turf/invariant');


/**
 * ES6 Generator iterates over the features of the featureCollection
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 * @param {any} featureCollection
 * @param {number} [start=0]
 * @param {any} [end=-1]
 * @returns a feature on success else false
 */
let iterateFeature = function* (featureCollection, start = 0, end = -1) {
  if(end === -1) end = featureCollection.features.length;

  for(start; start < end; start++) {
    yield featureCollection.features[start];
  }

  if(start === end) return false;
};

module.exports = turf;
module.exports.iterateFeature = iterateFeature;
