'use strict';

let KeyboardObserver = require('./observers/keyboardObserver').KeyboardObserver;
let LeafletObserver = require('./observers/leafletObserver').LeafletObserver;
let MouseObserver = require('./observers/mouseObserver').MouseObserver;
let canvasMap = require('./modules/canvasMap');
let leafletMap = require('./modules/leafletMap');
let defaults = require('./modules/options').defaults;
let calcClientRect = require('./libs/helpers').calcClientRect;
let Land = require('./modules/land').Land;

function shipcruising() {
  canvasMap.createCanvas(defaults.width, defaults.height);

  // Old execution order -> new one:
  // the map should be drawn when the route will be selected
  // (this will be triggered when the "go" button will be pressed
  /*
  // initMap is an async func we wait for a promise object to return with data
  let map = canvasMap.initMap().then((map) => {
    canvasMap.createPixelData();
    canvasMap.setScale();
    return map;
  });

  // the promise got resolved successfully the map exists then...
  map.then((fc) => {
    let land = new Land(fc);
    new LeafletObserver(land);
    new KeyboardObserver(land);
    new MouseObserver(land);
  });*/

  new MouseObserver();

  // Interactive map sector
  let clientRect = calcClientRect();
  leafletMap.init('tone-map', clientRect.width, clientRect.height);
};

shipcruising();
