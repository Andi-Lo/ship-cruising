'use strict';

let KeyboardObserver = require('./observers/keyboardObserver').KeyboardObserver;
let LeafletObserver = require('./observers/leafletObserver').LeafletObserver;
let MouseObserver = require('./observers/mouseObserver').MouseObserver;
let canvasMap = require('./modules/canvasMap');
let leafletMap = require('./modules/leafletMap');
let defaults = require('./modules/options').defaults;
let calcClientRect = require('./modules/options').calcClientRect;
let Land = require('./modules/land').Land;

function shipcruising() {
  canvasMap.createCanvas(defaults.width, defaults.height);

  // Get map (linestrings) regarding the route
  // out of the coastsmap
  // let map = {};
  // fetch('./map/route_test.geojson').then((parse) => parse.json()).then((geoRoute) => {
  //   fetch('./map/coasts_50m.geojson').then((parse) => parse.json()).then((geoMap) => {
  //     // Just get and draw the land that is near the route
  //     let coastFcPoints = canvasMap.calcRelevantCoastPoints(geoRoute, geoMap);
  //     map = canvasMap.initMap(coastFcPoints).then((map) => {
  //       canvasMap.createPixelData();
  //       canvasMap.setScale();
  //       return map;
  //     });
  //   });
  // });

  let map = canvasMap.initMap().then((map) => {
    canvasMap.createPixelData();
    canvasMap.setScale();
    return map;
  });

  // initMap is an async func we wait for a promise object to return with data
  /* let map = canvasMap.initMap('./map/coasts_50m.geojson').then((map) => {
    canvasMap.createPixelData();
    canvasMap.setScale();
    return map;
  });*/

  // the promise got resolved successfully the map exists then...
  map.then((fc) => {
    let land = new Land(fc);
    new LeafletObserver(land);
    new KeyboardObserver(land);
    new MouseObserver(land);
  });

  // Interactive map sector
  let clientRect = calcClientRect();
  leafletMap.init('tone-map', clientRect.width, clientRect.height);
};

shipcruising();
