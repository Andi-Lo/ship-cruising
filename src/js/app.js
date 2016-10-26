
function shipcruising(options) {
  'use strict';

  // var _ = require('underscore');
  var createMap = require('./modules/createMap');
  var draw = require('./modules/draw');
  var grid = require('./modules/grid');
  var turf = require('./modules/turf');
  var el = window.document.getElementById('ship-cruising');

  var defaults = {
    'strokeColor': 'rgba(255, 80, 255, 0.8)',
    'pointColor': 'rgba(255, 50, 10, 0.8)',
    'mapColor': '#000',
    'width': 640,
    'height': 640
  };

  var canvas = createMap(defaults.width, defaults.height);
  var ctx = canvas.getContext('2d');
  var grid = grid(ctx);
  el.appendChild(canvas);

  fetch('./map/map.geojson').then((parse) => parse.json()).then((geo) => {
    // draw map
    geo.features.forEach((features) => {
      switch (features.geometry.type) {
        case "Polygon":
          turf.meta.featureEach(features, function(coords) {
            draw.drawMultiPolygon(ctx, coords, defaults.mapColor);
          });
          break;
      }
    });
  });

  fetch('./map/route.geojson').then((parse) => parse.json()).then((geo) => {
    // draw points
    geo.features.forEach((features) => {
      switch (features.geometry.type) {
        case "Point":
          draw.drawPoint(
            ctx,
            features.geometry.coordinates,
            defaults.pointColor,
            4
          );
          break;
      }
    });

    draw.drawRoute(ctx, geo, defaults.strokeColor);
  });
};

shipcruising();
