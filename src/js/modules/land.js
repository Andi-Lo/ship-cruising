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
    console.log('fc', fc, metersPerPixel);
    let equidistant = turf.equidistantPointsZoom(fc, metersPerPixel);
    this._equidistantPoints = equidistant;
    return equidistant;
  }

  set land(land) { this._land = land; }
  get land() { return this._land; }

}

module.exports.Land = Land;
