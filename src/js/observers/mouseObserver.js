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

class MouseObserver extends Observer {
  constructor() {
    super();
    let calc = window.document.getElementById('calc');

    calc.addEventListener('click', function(evt) {
      let select = window.document.getElementsByClassName('dropdown')[0];
      select.option = select.options[select.selectedIndex].value;
      let path = `./map/${select.option}.geojson`;
      let features = new Loader(path);

      features.then((fcRoute) => {
        let geoMap = new Loader('./map/coasts_50m.geojson');

        geoMap.then((fcMap) => {
          drawCanvas.clearCanvas();

          // Calc bbox
          defaults.bbox = canvasMap.calcBbox(fcRoute);
          // Expand the bbox by a factor of 2
          defaults.bbox = turf.size(defaults.bbox, 2);
          let geoMap = canvasMap.initMap(fcMap, defaults.bbox);
          canvasMap.createPixelData();
          canvasMap.setScale();

          let land = new Land(geoMap);
          new LeafletObserver(land);
          new KeyboardObserver(land);

          addRouteToPixelMap(fcRoute, land);
        });
      });
    });

    function addRouteToPixelMap(route, land) {
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
  }
}

module.exports.MouseObserver = MouseObserver;
