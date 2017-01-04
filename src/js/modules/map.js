'use strict';

let Loader = require('../libs/loader').Loader;

class Map {
  constructor(path) {
    let geoMap = new Loader(path);
    geoMap.then((geo) => {
      this._map = geo;
    });
    return geoMap;
  }

  get map() {
    return this._map;
  }
}

module.exports.Map = Map;
