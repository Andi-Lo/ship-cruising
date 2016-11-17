
function shipcruising() {
  'use strict';

  let canvasMap = require('./modules/canvasMap');
  let draw = require('./modules/drawCanvas');
  let mercator = require('./modules/mercator');
  let leafletMap = require('./modules/leafletMap');
  let el = window.document.getElementById('ship-cruising');
  let elInteractive = window.document.getElementById('interactive-map');
  let defaults = require('./modules/options').defaults;
  let canvas = canvasMap.createMap(defaults.width, defaults.height);
  let ctx = canvas.getContext('2d');
  el.appendChild(canvas);

  canvasMap.init();


  // Interactive map sector
  leafletMap.createToneMapDiv(elInteractive, 'tone-map');
  leafletMap.createMapboxMapDiv(elInteractive, 'mapbox-map');
};

shipcruising();
