'use strict';

let turf = require('../libs/turf');
let leafletMap = require('./leafletMap');

class Land {
  constructor(fc) {
    this._land = fc;
    this._radiusLeafletPoints = 5;
    this._equidistantPoints;
    this.calculateLandInit(this._land);
  }

  calculateLandInit(fc) {
    let map = leafletMap.getMap();
    let metersPerPixel = leafletMap.getMetersPerPixel(map);
    let lineString = turf.multipolToLineString(fc);
    let equidistant = turf.equidistantPointsZoom(lineString, metersPerPixel);
    this._equidistantPoints = equidistant;
    return equidistant;
  }

  set land(land) { this._land = land; }
  get land() { return this._land; }

}

module.exports.Land = Land;
