'use strict';

let turf = require('../libs/turf');
let pathfinding = require('../libs/pathfinding');

class Route {
  constructor(fc) {
    this._waypoints = fc;
    this.calcRoute(this._waypoints).simplifyPath(0.1).smoothCurve();
    this._route = turf.equidistant(this._route, 100);
    this._route = turf.fixRoute(this._route);
    return this;
  }

  set route(route) { this._route = route; }
  get route() { return this._route; }

  get waypoints() { return this._waypoints; }

  /**
   * Uses pathfinding.js to find a route for the given
   * featureCollection of harbours.
   * @param {any} fc
   * @returns a featureCollection where each feature is a linestring
   * representing a step of the route
   * @memberOf Route
   */
  calcRoute(fc) {
    this._route = pathfinding(fc);
    return this;
  }

  /**
   * Simplifies the coordinates of a given featureCollection and
   * @param {any} featureCollection
   * @param {number} [tolerance = 0.01]
   * @returns a simplified featureCollection of type linestring
   *
   * @memberOf Route
   */
  simplifyPath(tolerance = 0.01) {
    let lineString = [];
    turf.meta.featureEach(this._route, function(feature) {
      let simplified = turf.simplify(feature, tolerance, false);
      lineString.push(simplified);
    });
    this._route = turf.featureCollection(lineString);
    return this;
  };

  /**
   * Takes a featureCollection and transforms the containing
   * features into bezier curves.
   * @param {any} featureCollection
   * @param {number} [resolution = 10000]
   * @param {number} [sharpness = 0.4]
   * @returns simplified featureCollection of bezier curve features
   *
   * @memberOf Route
   */
  smoothCurve(resolution = 10000, sharpness = 0.4) {
    let bezier = [];
    turf.meta.featureEach(this._route, function(feature) {
      let curve = turf.bezier(feature, resolution, sharpness);
      bezier.push(turf.simplify(curve, 0.01, false));
    });
    this._route = turf.featureCollection(bezier);
    return this;
  }

};

module.exports.Route = Route;
