'use strict';

let MouseObserver = require('./observers/mouseObserver').MouseObserver;
let DropObserver = require('./observers/dropObserver').DropObserver;
let LeafletObserver = require('./observers/leafletObserver').LeafletObserver;
let canvasMap = require('./modules/canvasMap');
let leafletMap = require('./modules/leafletMap');
let defaults = require('./modules/options').defaults;
let Map = require('./modules/map').Map;

function shipcruising() {
  let promise = new Map('./map/coasts_50m.geojson');
  promise.then((fc) => {
    new MouseObserver(fc);
    new DropObserver('drop-zone', fc);
    new LeafletObserver();
  });

  leafletMap.init();
};

shipcruising();
