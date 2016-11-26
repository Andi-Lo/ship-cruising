'use strict';

let KeyboardObserver = require('./observers/keyboardObserver').KeyboardObserver;
let LeafletObserver = require('./observers/leafletObserver').LeafletObserver;
let canvasMap = require('./modules/canvasMap');
let leafletMap = require('./modules/leafletMap');
let defaults = require('./modules/options').defaults;

function shipcruising() {
  new KeyboardObserver();

  canvasMap.createCanvas(defaults.width, defaults.height);

  // initMap is an async func we wait for a promise object to return with data
  let map = canvasMap.initMap('./map/jamaica.geojson').then((map) => {
    return map;
  });

  // if the promise got resolved successfully then()....
  map.then(function(tset) {
    canvasMap.createPixelData();
    canvasMap.setScale();
  });

  // Interactive map sector
  let elInteractive = window.document.getElementById('interactive-map');
  leafletMap.init(elInteractive, 'tone-map', 640, 640);
  new LeafletObserver();
};

shipcruising();
