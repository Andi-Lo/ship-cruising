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
    // let stepSize = mercator.getOrigin(defaults.bbox).stepSize;
    // this._route = turf.equidistant(this._route, stepSize);
    console.log('this.route', this._route);
    this.mergeSimilarRoutes(this._route, 5);
    // this.simplifyPath(0.01).smoothCurve(0.02, 0.3);
    // this._route = this.fixRoute(this._route);
    return this;
  }

  set route(route) { this._route = route; }
  get route() { return this._route; }

  get waypoints() { return this._waypoints; }

  leastSquares(fc, threshold = 10) {
    for(let i = 0; i < fc.features.length; i++) {
      for(let j = 0; j < fc.features[i].geometry.coordinates.length; j++) {
        if((i+1) < fc.features.length) {
          for(let k = 0; k < fc.features[i+1].geometry.coordinates.length; k++) {
            let a = turf.point(fc.features[i].geometry.coordinates[j]);
            let b = turf.point(fc.features[i+1].geometry.coordinates[k]);
            let distanceToPoint = turf.distance(a, b);
            if (distanceToPoint < threshold && distanceToPoint > 0) {
              console.log('distance', distanceToPoint);
              fc.features[i].geometry.coordinates[j] = b.geometry.coordinates;
            }
          };
        }
      };
    };
    console.log('fc new', fc);
  };

  mergeSimilarRoutes(fc, threshold = 10) {
    let nearestPoint;
    let minDist = Infinity;
    for(let i = 0; i < fc.features.length; i++) {
      for(let j = 0; j < fc.features[i].geometry.coordinates.length; j++) {
        let a = turf.point(fc.features[i].geometry.coordinates[i]);
        let b = turf.point(fc.features[i].geometry.coordinates[j]);
        let distanceToPoint = turf.distance(a, b, 'kilometers');
        if (distanceToPoint < threshold && distanceToPoint > 0) {
          fc.features[i].geometry.coordinates[i] = b.geometry.coordinates;
          nearestPoint = b;
          minDist = distanceToPoint;
          console.log('minDist', minDist);
          console.log(turf.featureCollection([a, b]));
        }
      }
    }
    console.log('fc new', fc);
    return nearestPoint;
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
  smoothCurve(tolerance = 0.01, sharpness = 0.4) {
    let bezier = [];
    let curve;
    turf.meta.featureEach(this._route, function(feature) {
      curve = turf.bezier(feature, 10000, sharpness);
      if(tolerance === 0)
        bezier.push(curve);
      else
        bezier.push(turf.simplify(curve, tolerance, false));
    });
    this._route = turf.featureCollection(bezier);
    return this;
  }

};

module.exports.Route = Route;
