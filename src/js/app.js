
function shipcruising(options) {
  'use strict';

  var canvasMap = require('./modules/canvasMap');
  var draw = require('./modules/draw');
  var mercator = require('./modules/mercator');
  var el = window.document.getElementById('ship-cruising');
  var options = require('./modules/options');
  var defaults = options.defaults;

  var canvas = canvasMap.createMap(defaults.width, defaults.height);
  var ctx = canvas.getContext('2d');
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
    var dist = mercator.calcScale('kilometers');
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
};

shipcruising();
