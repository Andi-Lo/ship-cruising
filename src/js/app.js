
function shipcruising(options) {
  'use strict';

  // var _ = require('underscore');
  var createMap = require('./modules/createMap');
  var draw = require('./modules/draw');
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
  el.appendChild(canvas);

  // draw.drawPolygon(ctx, data, defaults.mapColor);

  fetch('./map/map.geojson').then((res) => res.json()).then((geo) => {
    // draw map
    geo.features.forEach((features) => {
      const {type, coordinates} = features.geometry;

      switch (type) {

      case "Polygon":
        draw.drawPolygon(ctx, coordinates, defaults.mapColor);
        break;
      // case "MultiPolygon": return drawPolygon(ctx, coordinates);

      }
    });
  });

  fetch('./map/route.geojson').then((res) => res.json()).then((geo) => {
    // draw points
    geo.features.forEach((features) => {
      const {type, coordinates} = features.geometry;

      switch (type) {

      case "Point":
        draw.drawPoint(ctx, coordinates, defaults.pointColor);
        break;

      }
    });

    var route = [];
    route.push('length', geo.features.length);
    route.push('iterator', 0);

    // draw route
    geo.features.forEach((features) => {
      const {type, coordinates} = features.geometry;

      switch (type) {

      case "Point":
        draw.drawRoute(ctx, coordinates, defaults.strokeColor, route);
        route.iterator++;
        break;

      }
    });
  });
};

shipcruising();
