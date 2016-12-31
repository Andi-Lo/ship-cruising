'use strict';

let Observer = require('./observer').Observer;
let drawLeaflet = require('../modules/drawLeaflet');
let drawCanvas = require('../modules/drawCanvas');
let Loader = require('../libs/loader').Loader;
let forces = require('../forces/forces');
let defaults = require('../modules/options').defaults;
let canvasMap = require('../modules/canvasMap');
let LeafletObserver = require('../observers/leafletObserver').LeafletObserver;
let KeyboardObserver = require('../observers/keyboardObserver').KeyboardObserver;
let Land = require('../modules/land').Land;

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
          let geoMap = canvasMap.initMap(fcMap, defaults.bbox);
          canvasMap.createPixelData();
          canvasMap.setScale();

          let land = new Land(geoMap);
          new LeafletObserver(land);
          new KeyboardObserver(land);
        });
      });
    });
  }

}

module.exports.MouseObserver = MouseObserver;
