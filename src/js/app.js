'use strict';

let MouseObserver = require('./observers/mouseObserver').MouseObserver;
let DropObserver = require('./observers/dropObserver').DropObserver;
let LeafletObserver = require('./observers/leafletObserver').LeafletObserver;
let leafletMap = require('./modules/leafletMap');
let Map = require('./modules/map').Map;

function shipcruising() {
  let promise = new Map('./map/coastline_2025_tiles.geojson');
  promise.then((fc) => {
    new MouseObserver(fc);
    new DropObserver('drop-zone', fc);
    new LeafletObserver();
  });

  leafletMap.init();
};

shipcruising();
