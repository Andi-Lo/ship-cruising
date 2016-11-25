'use strict';

let Observer = require('./observer').Observer;
let Route = require('../modules/route').Route;
let drawLeaflet = require('../modules/drawLeaflet');
let canvasMap = require('../modules/canvasMap');
let forces = require('../forces/forces');

class KeyboardObserver extends Observer {
  constructor() {
    super();
    window.addEventListener("keydown", function(evt) {
      if(evt.defaultPrevented) {
        return; // Do nothing if the evt was already processed
      }

      switch (evt.key) {
        case "Enter":
          try {
            let features = canvasMap.getFeatures();
            let route = new Route(features);
            route.drawRoute(route._route);
            drawLeaflet.drawPolyline(route._route);
            drawLeaflet.drawMarkers(route._waypoints);

            forces.force(route._route);

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

