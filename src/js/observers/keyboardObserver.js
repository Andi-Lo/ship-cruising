'use strict';

let Observer = require('./observer').Observer;
let ForceObserver = require('./forceObserver').ForceObserver;
let Route = require('../modules/route').Route;
let drawLeaflet = require('../modules/drawLeaflet');
let drawCanvas = require('../modules/drawCanvas');
let canvasMap = require('../modules/canvasMap');
let forces = require('../forces/forces');

class KeyboardObserver extends Observer {
  constructor() {
    super();
    window.addEventListener("keydown", function(evt) {
      if(evt.defaultPrevented) {
        return; // Do nothing if the evt was already processed
      }

      let route = [];

      switch (evt.key) {
        case "Enter":
          try {
            let features = canvasMap.getFeatures();
            route = new Route(features);

            drawCanvas.drawLineString(route._route);
            drawCanvas.drawPixels(route._route);

            drawLeaflet.drawPolyline(route._route);
            drawLeaflet.drawMarkers(route._waypoints);

            let simulation = forces.force(route._route);

            new ForceObserver(simulation);

            canvasMap.setFeatures([]);
          }
          catch(e) {
            throw e;
          }
          finally {
            canvasMap.setFeatures([]);
          }
          break;
        default:
          return; // Quit when this doesn't handle the key evt.
      }
      // Cancel the default action to avoid it being handled twice
      evt.preventDefault();
    }, true);
  }

}

module.exports.KeyboardObserver = KeyboardObserver;
