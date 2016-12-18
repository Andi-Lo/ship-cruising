'use strict';

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
