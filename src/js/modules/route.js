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
    this._waypoints = this.fixWaypoints(fcWaypoints, fcMap);
    this._route = this.calcRoute(this._waypoints, fcMap);
    // this.calcRoute(this._waypoints).simplifyPath(0.1).smoothCurve();
    let stepSize = mercator.getOrigin(defaults.bbox).stepSize;
    this._route = turf.equidistant(this._route, stepSize);
    this._route = this.fixRoute(this._route);
    return this;
  }

  set route(route) { this._route = route; }
  get route() { return this._route; }

  get waypoints() { return this._waypoints; }

  /**
   * Findes harbours that lay inside of landmarks instead of water and sets them
   * onto the nearest point of the coastline. This is neccessary to
   * make sure the pathfinding algorithm will find a route between A and B.
   *
   * @param {FeatureCollection<Point>}
   * @param {FeatureCollection<(LineString|MultiLineString)>}
   * @returns {FeatureCollection<Point>} fixed harbour coordinates
   *
   * @memberOf Route
   */
  fixWaypoints(fcWaypoints, fcMap) {
    let bbox = turf.square(turf.calcBbox(fcWaypoints));
    fcMap = turf.clipPolygon(fcMap, turf.size(bbox, 2));
    let pointsInside = turf.isInside(fcMap, fcWaypoints);
    return this.setPointsOutside(pointsInside, fcMap);
  }

  /**
   * This function will find the nearest coastline point for each harbour
   * that lays inside of land. It then calculates the bearing between those 2
   * points and sets the new harbour location in a distance along the bearing.
   *
   * @example example of bearing calculation: http://turfjs.org/examples/turf-bearing/
   * @param {FeatureCollection<Point>}
   * @param {FeatureCollection<LineString>}
   * @returns {FeatureCollection<Point>} harbour locations outside of landmass
   *
   * @memberOf Route
   */
  setPointsOutside(fcWaypoints, fcMap) {
    let point = {};
    let fcPoint = turf.fcToFcPoints(fcMap);
    turf.meta.featureEach(fcWaypoints, function(featureRoute) {
      if(featureRoute.properties.isInsideLand == true) {
        point = turf.point(featureRoute.geometry.coordinates);
        let nearest = turf.nearest(point, fcPoint);
        let bearing = turf.bearing(point, nearest);
        let dest = turf.destination(nearest, .6, bearing, 'kilometers');
        featureRoute.geometry.coordinates = dest.geometry.coordinates;
      }
    });
    return fcWaypoints;
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
    return pathfinding(fcWaypoints, fcMap);
  }

  /**
   * Takes a featureCollection of type LineString and fixes
   * the start and end point of the route by resetting those
   * points to their initial waypoint value. This should close gaps
   * between the subsection of two routes.
   *
   * @param {FeatureCollection<LineString>} featureCollection of type LineString
   * @returns featureCollection
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
   * @param {number} [sharpness=0.4]
   * @returns {FeatureCollection<LineString>} simplified bezier curve features
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
