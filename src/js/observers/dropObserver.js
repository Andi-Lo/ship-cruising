'use strict';

let Observer = require('./observer').Observer;
let drawLeaflet = require('../modules/drawLeaflet');
let drawCanvas = require('../modules/drawCanvas');
let Loader = require('../libs/loader').Loader;
let forces = require('../forces/forces');
let defaults = require('../modules/options').defaults;
let canvasMap = require('../modules/canvasMap');
let LeafletObserver = require('./leafletObserver').LeafletObserver;
let KeyboardObserver = require('./keyboardObserver').KeyboardObserver;
let ForceObserver = require('./forceObserver').ForceObserver;
let Land = require('../modules/land').Land;
let mercator = require('../libs/mercator');
let turf = require('../libs/turf');
let Route = require('../modules/route').Route;


let routeLeafletColor = "red";
let routeLeafletWeight = 1;

class DropObserver extends Observer {
  constructor(selector) {
    super();
    this.dndController(selector).then((files) => {
      let reader = new FileReader();
      reader.onloadend = function(e) {
        let fc = JSON.parse(reader.result);
        DropObserver.drawRoute(fc);
      };
      reader.readAsText(files[0]);
    });
  }

  static drawRoute(fc) {
    let geoMap = new Loader('./map/coasts_50m.geojson');
    geoMap.then((fcMap) => {
      drawCanvas.clearCanvas();

      // Calc bbox
      defaults.bbox = canvasMap.calcBbox(fc);
      // Expand the bbox by a factor of 2
      defaults.bbox = turf.size(defaults.bbox, 1.5);
      let geoMap = canvasMap.initMap(fcMap, fc, defaults.bbox);
      canvasMap.createPixelData();
      canvasMap.setScale();

      let land = new Land(geoMap);
      new LeafletObserver(land);
      new KeyboardObserver(land);

      DropObserver.addRouteToPixelMap(fc, land);
    });
  }

  static addRouteToPixelMap(route, land) {
    // Calc pixel data for every point
    turf.meta.coordEach(route, function(coord) {
      let pixelPos = mercator.posToPixel(coord);
      canvasMap.registerClick(pixelPos);
    });

    let features = canvasMap.getFeatures();
    route = new Route(features);

    drawCanvas.drawLineString(route._route, defaults.strokeColor);
    drawCanvas.drawPixels(route._route);

    drawLeaflet.drawPolyline(route._route,
      routeLeafletColor,
      routeLeafletWeight);
    drawLeaflet.drawMarkers(route._waypoints);

    let simulation = forces.force(route._route, land._equidistantPoints);
    new ForceObserver(simulation);

    canvasMap.setFeatures([]);
  }

  dndController(selector) {
    return new Promise(function(resolve, reject) {
      let el_ = window.document.getElementsByClassName(selector)[0];

      el_.dragenter = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.add('dropping');
      };

      el_.dragover = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.add('dropping');
      };

      el_.dragleave = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.remove('dropping');
      };

      el_.drop = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.remove('dropping');
        return resolve(e.dataTransfer.files);
      };

      el_.addEventListener('dragenter', el_.dragenter, false);
      el_.addEventListener('dragover', el_.dragover, false);
      el_.addEventListener('dragleave', el_.dragleave, false);
      el_.addEventListener('drop', el_.drop, false);
    });
  }
}

module.exports.DropObserver = DropObserver;
