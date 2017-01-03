'use strict';

let MouseObserver = require('./observers/mouseObserver').MouseObserver;
let DropObserver = require('./observers/DropObserver').DropObserver;
let canvasMap = require('./modules/canvasMap');
let leafletMap = require('./modules/leafletMap');
let defaults = require('./modules/options').defaults;
let calcClientRect = require('./libs/helpers').calcClientRect;

function shipcruising() {
  canvasMap.createCanvas(defaults.width, defaults.height);

  new MouseObserver();
  new DropObserver('drop-zone');

  // Interactive map sector
  let clientRect = calcClientRect();
  leafletMap.init('tone-map', clientRect.width, clientRect.height);
};

shipcruising();
