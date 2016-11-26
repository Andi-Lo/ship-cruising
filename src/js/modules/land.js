'use strict';

let turf = require('../libs/turf');

class Land {
  constructor(fc) {
    this._land = this.calculateLand(fc);
  }

  calculateLand(fc) {
    // transforming the multiPolygon fc to a lineString fc
    let lineString = turf.multipolToLineString(fc);
    let equidistant = turf.equidistantLineString(lineString);
    console.log('equidistant', equidistant);
  }

  set land(land) { this._land = land; }
  get land() { return this._land; }

}

module.exports.Land = Land;
