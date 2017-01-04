'use strict';

let turf = require('../libs/turf');
let drawCanvas = require('../modules/drawCanvas');
let drawLeaflet = require('../modules/drawLeaflet');
let canvasMap = require('../modules/canvasMap');
let Route = require('../modules/route').Route;
let mercator = require('../libs/mercator');
let defaults = require('../modules/options').defaults;

let routeLeafletColor = "red";
let routeLeafletWeight = 1;

class Observer {
  constructor() {
  }

  static addRouteToPixelMap(fcRoute, fcMap) {
    let route = new Route(fcRoute, fcMap);

    drawCanvas.drawLineString(route._route, defaults.strokeColor);
    drawCanvas.drawPixels(route._route);

    drawLeaflet.drawPolyline(route._route,
        routeLeafletColor,
        routeLeafletWeight);
    drawLeaflet.drawMarkers(route._waypoints);

    // let simulation = forces.force(route._route, land._equidistantPoints);
    // new ForceObserver(simulation);

    canvasMap.setFeatures([]);
  }
}

module.exports.Observer = Observer;

