'use strict';

let Observer = require('./observer').Observer;
let drawLeaflet = require('../modules/drawLeaflet');
let drawCanvas = require('../modules/drawCanvas');
let Loader = require('../libs/loader').Loader;
let forces = require('../forces/forces');
let Route = require('../modules/route').Route;
let ForceObserver = require('./forceObserver').ForceObserver;
let defaults = require('../modules/options').defaults;
let canvasMap = require('../modules/canvasMap');

let routeLeafletColor = "red";
let routeLeafletWeight = 1;

class MouseObserver extends Observer {
  constructor() {
    super();
    let calc = window.document.getElementById('calc');
    let route = [];

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
          canvasMap.initMap(fcMap, defaults.bbox);
          /* route = new Route(fcRoute);

          drawCanvas.drawLineString(route._route);
          drawCanvas.drawPixels(route._route);

          drawLeaflet.drawPolyline(route._route,
            routeLeafletColor,
            routeLeafletWeight);
          drawLeaflet.drawMarkers(route._waypoints);

          let simulation = forces.force(route._route, land._equidistantPoints);
          new ForceObserver(simulation);*/
        });
      });
    });

    /* calc.addEventListener('click', function(evt) {
      let select = window.document.getElementsByClassName('dropdown')[0];
      select.option = select.options[select.selectedIndex].value;
      let path = `./map/${select.option}.geojson`;
      let features = new Loader(path);
      features.then((fc) => {
        route = new Route(fc);

        drawCanvas.drawLineString(route._route);
        drawCanvas.drawPixels(route._route);

        drawLeaflet.drawPolyline(route._route,
            routeLeafletColor,
            routeLeafletWeight);
        drawLeaflet.drawMarkers(route._waypoints);

        let simulation = forces.force(route._route, land._equidistantPoints);
        new ForceObserver(simulation);
      });
    }); */
  }

}

module.exports.MouseObserver = MouseObserver;
