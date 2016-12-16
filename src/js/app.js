'use strict';

let KeyboardObserver = require('./observers/keyboardObserver').KeyboardObserver;
let LeafletObserver = require('./observers/leafletObserver').LeafletObserver;
let canvasMap = require('./modules/canvasMap');
let leafletMap = require('./modules/leafletMap');
let defaults = require('./modules/options').defaults;
let calcClientRect = require('./modules/options').calcClientRect;
let Land = require('./modules/land').Land;

function shipcruising() {
  canvasMap.createCanvas(defaults.width, defaults.height);

  // initMap is an async func we wait for a promise object to return with data
  let map = canvasMap.initMap('./map/jamaica.geojson').then((map) => {
    canvasMap.createPixelData();
    canvasMap.setScale();
    return map;
  });

  // the promise got resolved successfully the map exists then...
  map.then((fc) => {
    let land = new Land(fc);
    new LeafletObserver(land);
    new KeyboardObserver(land);
  });

  // Interactive map sector
  let elInteractive = window.document.getElementById('interactive-map');
  let clientRect = calcClientRect();
  leafletMap.init(elInteractive, 'tone-map', clientRect.width, clientRect.height);
};

shipcruising();
