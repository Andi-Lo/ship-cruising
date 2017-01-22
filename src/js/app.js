'use strict';

let MouseObserver = require('./observers/mouseObserver').MouseObserver;
let DropObserver = require('./observers/dropObserver').DropObserver;
let leafletMap = require('./modules/leafletMap');
let Loader = require('./libs/loader').Loader;

function shipcruising() {
  let promise = new Loader('./map/coasts_10m.geojson');
  promise.then((fc) => {
    new MouseObserver(fc);
    new DropObserver('drop-zone', fc);
  });

  leafletMap.init();
};

shipcruising();
