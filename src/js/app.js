'use strict';

let MouseObserver = require('./observers/mouseObserver').MouseObserver;
let DropObserver = require('./observers/DropObserver').DropObserver;
let LeafletObserver = require('./observers/leafletObserver').LeafletObserver;
let canvasMap = require('./modules/canvasMap');
let leafletMap = require('./modules/leafletMap');
let defaults = require('./modules/options').defaults;
let calcClientRect = require('./libs/helpers').calcClientRect;
let Map = require('./modules/map').Map;

function shipcruising() {
  canvasMap.createCanvas(defaults.width, defaults.height);

  let promise = new Map('./map/coasts_50m.geojson');
  promise.then((fc) => {
    new MouseObserver(fc);
    new DropObserver('drop-zone', fc);
    new LeafletObserver();
  });

  // Interactive map sector
  let clientRect = calcClientRect();
  leafletMap.init('tone-map', clientRect.width, clientRect.height);
};

shipcruising();
