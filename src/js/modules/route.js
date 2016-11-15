'use strict';

let turf = require('./turf');
let pathfinding = require('./pathfinding');
let draw = require('./drawCanvas');

class Route {
  constructor(features) {
    this._waypoints = turf.featureCollection(features);
    this._route = this.calcRoute(features);

    draw.drawLineString(this._route);
    draw.drawPixels(this._route);
  }

  set route(route) { this._route = route; }
  get route() { return this._route; }

  get waypoints() { return this._waypoints; }

  calcRoute(features) {
    let fc = turf.featureCollection(features);
    let route = pathfinding(fc);
    return route;
  }
};

module.exports.Route = Route;
