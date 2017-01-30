'use strict';

/**
 * Loader class that can be used to load geojson files. Will return a promise.
 *
 * @public
 * @class
 * @returns {Promise} Promise object that get's resolved as soon as the map got loaded, containing its data
 */
class Loader {
  constructor(path) {
    return new Promise(function(resolve, reject) {
      fetch(path).then((parse) => parse.json()).then((geo) => {
        return resolve(geo);
      });
    });
  }
}

module.exports.Loader = Loader;
