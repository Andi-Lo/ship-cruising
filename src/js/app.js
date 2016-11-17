'use strict';

function shipcruising() {
  let canvasMap = require('./modules/canvasMap');
  let leafletMap = require('./modules/leafletMap');
  let defaults = require('./modules/options').defaults;

  let elInteractive = window.document.getElementById('interactive-map');

  canvasMap.createMap(defaults.width, defaults.height);
  canvasMap.init('./map/jamaica.geojson');

  // Interactive map sector
  leafletMap.createToneMapDiv(elInteractive, 'tone-map');
  leafletMap.createMapboxMapDiv(elInteractive, 'mapbox-map');
};

shipcruising();
