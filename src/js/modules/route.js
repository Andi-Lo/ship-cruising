'use strict';

let turf = require('../libs/turf');
let pathfinding = require('../libs/pathfinding');
let mercator = require('../libs/mercator');
let defaults = require('../modules/options').defaults;

/**
 * The route class
 *
 * @public
 * @class Route
 */
class Route {
  /**
   * Creates an instance of Route.
   *
   * @param {FeatureCollection<Point>} fcWaypoints
   * @param {FeatureCollection<(LineString|MultiLineString)>} fcMap a geojson map
   *
   * @memberOf Route
   */
  constructor(fcWaypoints, fcMap) {
    const TRESHOLD = 2;
    const TOLERANCE_IN_PX = 0.05;
    const SHARPNESS = 0.15;
    this._waypoints = fcWaypoints;
    this.calcRoute(this._waypoints, fcMap);
    let stepSize = mercator.getOrigin(defaults.bbox).stepSize;
    this._route = turf.equidistant(this._route, stepSize);
    this.mergeSimilarRoutes(TRESHOLD)
        .simplifyPath(TOLERANCE_IN_PX)
        .smoothCurve(SHARPNESS)
        .fixRoute();
    return this;
  }

  set route(route) { this._route = route; }
  get route() { return this._route; }

  get waypoints() { return this._waypoints; }

  /**
   * Tries to merge routes that lay closely to each other into one
   *
   * @param {FeatureCollection<LineString>}
   * @param {number} [threshold=3] number in kilometers should be > 0 < 10. Defines the radius where 2 points should be merged to 1.
   * @returns {Route}
   *
   * @memberOf Route
   */
  mergeSimilarRoutes(threshold = 3) {
    // creates a copy of a javascript object
    let copyFc = (JSON.parse(JSON.stringify(this._route)));
    let feature = copyFc.features.shift();
    let shifted = turf.featureCollection([feature]);
    // shift the features array to the left, and test it against the remaining features
    while(copyFc.features.length) {
      for(let k = 0; k < feature.geometry.coordinates.length; k++) {
        turf.meta.coordEach(copyFc, function(coord) {
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
      shifted.features.push(feature);
    }
    this._route = shifted;
    return this;
  }

  /**
   * Uses pathfinding.js to find a route for each harbour location
   *
   * @param {FeatureCollection<Point>}
   * @param {FeatureCollection<(LineString|MultiLineString)>}
   * @returns {Route} representing a step of the route
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
   * between the subsection of two route parts.
   *
   * @param {FeatureCollection<LineString>}
   * @returns {FeatureCollection<LineString>}
   */
  fixRoute() {
    turf.meta.featureEach(this._route, function(feature) {
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
    return this;
  };

  /**
   * Simplifies the coordinates of a given featureCollection
   *
   * @see http://turfjs.org/docs.html#simplify
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
   * @see http://turfjs.org/docs.html#bezier
   * @param {FeatureCollection<LineString>}
   * @param {number} [sharpness=0.4] higher values mean more curviness
   * @returns {FeatureCollection<LineString>} bezier curved route
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
