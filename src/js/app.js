
function shipcruising() {
  'use strict';

  let canvasMap = require('./modules/canvasMap');
  let draw = require('./modules/draw');
  let mercator = require('./modules/mercator');
  let leafletMap = require('./modules/leafletMap');
  let defaults = require('./modules/options').defaults;
  let el = window.document.getElementById('ship-cruising');
  let elInteractive = window.document.getElementById('interactive-map');

  let canvas = canvasMap.createMap(defaults.width, defaults.height);
  let ctx = canvas.getContext('2d');
  el.appendChild(canvas);

  fetch('./map/jamaica.geojson').then((parse) => parse.json()).then((geo) => {
    geo.features.forEach((features) => {
      switch (features.geometry.type) {
        case "Polygon":
          draw.drawPolygon(ctx, features, defaults.mapColor);
          break;

        case "Point":
          draw.drawPoint(ctx, features, defaults.pointColor, 4);
          break;

        case "MultiPolygon":
          draw.drawMultiPolygon(ctx, features, defaults.mapColor);
          break;

        default:
          console.log(features.geometry.type);
          break;
      }
    });
    canvasMap.createPixelData(canvas);
    let dist = mercator.calcScale('kilometers');
    canvasMap.setScale(dist);
  });

  fetch('./map/route.geojson').then((parse) => parse.json()).then((geo) => {
    geo.features.forEach((features) => {
      switch (features.geometry.type) {
        case "Point":
          // draw.drawPoint(ctx, features, defaults.pointColor, 4);
          break;
      }
    });
    // draw.drawRoute(ctx, geo, defaults.strokeColor);
  });

  // Interactive map sector
  leafletMap.createToneMapDiv(elInteractive, 'tone-map');
  leafletMap.createMapboxMapDiv(elInteractive, 'mapbox-map');
};

shipcruising();
