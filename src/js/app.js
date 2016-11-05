
function shipcruising(options) {
  'use strict';

  var createMap = require('./modules/createMap');
  var draw = require('./modules/draw');
  var el = window.document.getElementById('ship-cruising');
  var rgb2hex = require('rgb2hex');
  var defaults = {
    'strokeColor': 'rgba(255, 80, 255, 0.8)',
    'pointColor': 'rgba(255, 50, 10, 0.8)',
    'mapColor': '#000',
    'width': 640,
    'height': 640
  };

  var canvas = createMap(defaults.width, defaults.height);
  var ctx = canvas.getContext('2d');
  el.appendChild(canvas);

  fetch('./map/jamaica.geojson').then((parse) => parse.json()).then((geo) => {
    // console.log(geo);
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
    var color = ctx.getImageData(1, 1, 1, 1);
    var hex = rgb2hex('rgba(' + color.data +')');
    console.log('color rgba', color.data, 'color in hex', hex);

    // var colorData = new Array(640);
    // for (var i = 0; i < 640; i++) {
    //   colorData[i] = new Array(640);
    // }

    // for(var y = 0; y < 640; y++) {
    //   for(var x = 0; x < 640; x++) {
    //     color = ctx.getImageData(x, y, 1, 1);
    //     var hex = rgb2hex('rgba(' + color.data +')');
    //     colorData[x][y] = hex;
    //   }
    // }
    // console.log('data', colorData[640-1][640-1]);
  });

  fetch('./map/route.geojson').then((parse) => parse.json()).then((geo) => {
    geo.features.forEach((features) => {
      switch (features.geometry.type) {
        case "Point":
          draw.drawPoint(ctx, features, defaults.pointColor, 4);
          break;
      }
    });
    draw.drawRoute(ctx, geo, defaults.strokeColor);
  });
};

shipcruising();
