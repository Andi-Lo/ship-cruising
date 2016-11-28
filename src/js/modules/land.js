'use strict';

let turf = require('../libs/turf');
let drawLeaflet = require('./drawLeaflet');
let leafletMap = require('./leafletMap');

class Land {
  constructor(fc) {
    this._land = fc;
    this._radiusLeafletPoints = 5;
    // this._land = this.calculateLandInit(fc);
    this.calculateLandInit(this._land);
  }

  calculateLandInit(fc) {
    let map = leafletMap.getMaps()[0];
    let metersPerPixel = leafletMap.getMetersPerPixel(map);
    // transforming the multiPolygon fc to a lineString fc
    let lineString = turf.multipolToLineString(fc);
    // let equidistant = turf.equidistantLineString(lineString);
    // let equidistant = turf.equidistantPointsOnLine(lineString, 10);
    let equidistant = turf.equidistantPointsZoom(lineString, metersPerPixel);
    drawLeaflet.drawPointsCoastForces(equidistant, this._radiusLeafletPoints);
    return equidistant;
  }

  set land(land) { this._land = land; }
  get land() { return this._land; }

}

module.exports.Land = Land;
