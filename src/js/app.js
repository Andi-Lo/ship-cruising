'use strict';

let KeyboardObserver = require('./observers/keyboardObserver').KeyboardObserver;
let LeafletObserver = require('./observers/leafletObserver').LeafletObserver;
let canvasMap = require('./modules/canvasMap');
let leafletMap = require('./modules/leafletMap');
let defaults = require('./modules/options').defaults;

function shipcruising() {
  let elInteractive = window.document.getElementById('interactive-map');

  new KeyboardObserver();

  canvasMap.createMap(defaults.width, defaults.height);
  canvasMap.init('./map/jamaica.geojson');

  // Interactive map sector
  leafletMap.createToneMapDiv(elInteractive, 'tone-map');
  leafletMap.createMapboxMapDiv(elInteractive, 'mapbox-map');
  new LeafletObserver();
};

shipcruising();
