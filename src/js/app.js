'use strict';

let KeyboardObserver = require('./observers/keyboardObserver').KeyboardObserver;
let LeafletObserver = require('./observers/leafletObserver').LeafletObserver;
let canvasMap = require('./modules/canvasMap');
let leafletMap = require('./modules/leafletMap');
let defaults = require('./modules/options').defaults;
let Land = require('./modules/land').Land;

function shipcruising() {
  new KeyboardObserver();

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
  });

  // Interactive map sector
  let elInteractive = window.document.getElementById('ship-cruising');
  leafletMap.init(elInteractive, 'tone-map', 640, 640);
};

shipcruising();
