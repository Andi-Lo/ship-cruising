'use strict';

let turf = require('../libs/turf');
let pathfinding = require('../libs/pathfinding');
let mercator = require('../libs/mercator');
let defaults = require('../modules/options').defaults;

class Route {
  /**
   * Creates an instance of Route.
   *
   * @param {FeatureCollection<Point>} fcRoute
   * @param {FeatureCollection<(LineString|MultiLineString)>} geojson map
   *
   * @memberOf Route
   */
  constructor(fcWaypoints, fcMap) {
    this._waypoints = fcWaypoints;
    this.calcRoute(this._waypoints, fcMap);
    let stepSize = mercator.getOrigin(defaults.bbox).stepSize;
    this._route = turf.equidistant(this._route, stepSize);
    // For Belgien 0.01 and 0.85 are good values
    // For Brazil and so on the below are good values
    this.mergeSimilarRoutes(this._route, 2);
    this.simplifyPath(0.05).smoothCurve(0.15);
    // this._route = this.mergeSimilarRoutes(this._route, 1);
    this._route = this.fixRoute(this._route);
    return this;
  }

  set route(route) { this._route = route; }
  get route() { return this._route; }

  get waypoints() { return this._waypoints; }

  mergeSimilarRoutes(fc, threshold = 10) {
    let copyFc = (JSON.parse(JSON.stringify(fc))); // creates a copy of a javascript object
    let feature = copyFc.features.shift();
    let newFc = turf.featureCollection([feature]);
    // shift the features array to the left, and test it against the remaining features
    while(copyFc.features.length) { // for all sub-routes in routes
      for(let k = 0; k < feature.geometry.coordinates.length; k++) { // for all points of the n'th feature
        turf.meta.coordEach(copyFc, function(coord) { // for all points of the "n'th+1 to n" features
          if(copyFc.features.length > 0) {
            let a = turf.point(coord);
            let b = turf.point(feature.geometry.coordinates[k]);
            let distanceToPoint = turf.distance(a, b, 'kilometers');
            if(distanceToPoint < threshold && distanceToPoint > 0)
              feature.geometry.coordinates[k] = coord;
          }
        });
      }
      feature = copyFc.features.shift();
      newFc.features.push(feature);
    }
    fc = newFc;
    this._route = fc;
    return this;
  }

  /**
   * Uses pathfinding.js to find a route for each harbour location
   *
   * @param {FeatureCollection<Point>}
   * @param {FeatureCollection<(LineString|MultiLineString)>}
   * @returns {FeatureCollection<LineString>} each feature is a linestring
   * representing a step of the route
   *
   * @memberOf Route
   */
  calcRoute(fcWaypoints, fcMap) {
    this._route = pathfinding(fcWaypoints, fcMap);
    return this;
  }

  /**
   * Takes a featureCollection of type LineString and fixes
   * the start and end point of the route by resetting those
   * points to their initial waypoint value. This should close gaps
   * between the subsection of two routes.
   *
   * @param {FeatureCollection<LineString>}
   * @returns {FeatureCollection<LineString>}
   */
  fixRoute(fc) {
    turf.meta.featureEach(fc, function(feature) {
      let length = feature.geometry.coordinates.length;
      if(feature.properties.start && feature.properties.end) {
        // there have to be at least 2 points for this to make sense
        if(length > 0) {
          feature.geometry.coordinates[0] = feature.properties.start;
          feature.geometry.coordinates[length-1] = feature.properties.end;
        }
      }
      else {
        let first = feature.geometry.coordinates[0];
        let last = feature.geometry.coordinates[length-1];
        if(first[0] !== last[0] || first[1] !== last[1]) {
          feature.geometry.coordinates.push(first);
        }
      }
    });
    return fc;
  };

  /**
   * Simplifies the coordinates of a given featureCollection
   *
   * @param {FeatureCollection<LineString>}
   * @param {number} [tolerance=0.01] tolerance of simplification
   * @returns {FeatureCollection<LineString>} simplified route
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
   *
   * @param {FeatureCollection<LineString>}
   * @param {number} [resolution=10000]
   * @param {number} [sharpness=0.4] higher values mean more curviness
   * @returns {FeatureCollection<LineString>} simplified bezier curve features
   *
   * @memberOf Route
   */
  smoothCurve(sharpness = 0.4) {
    let bezier = [];
    let curve;
    turf.meta.featureEach(this._route, function(feature) {
      curve = turf.bezier(feature, 10000, sharpness);
      bezier.push(curve);
    });
    this._route = turf.featureCollection(bezier);
    return this;
  }

};

module.exports.Route = Route;
