'use strict';

var mercator = require('./mercator');
var turf = require('./turf');

var unpackMultiPolCoords = function(features) {
  var data = [];

  turf.meta.featureEach(features, function(feature) {
    var coordCollection = feature.geometry.coordinates;
    coordCollection.forEach(function(coords) {
      coords.forEach(function(coord) {
        data.push(coord);
      });
    });
  });
  return data;
};

var drawLine = function(ctx, coord, isFirst, stroke = false) {
  var pixel = mercator.posToPixel(coord);

  if(pixel.x > 0 || pixel.y > 0) {
    if(isFirst === true) {
      ctx.beginPath();
      ctx.moveTo(pixel.x, pixel.y);
      isFirst = false;
    }
    else {
      ctx.lineTo(pixel.x, pixel.y);
      if (stroke === true) {
        ctx.stroke();
      }
    }
  }
  return isFirst;
};

var drawMultiPolygon = function(ctx, features, color) {
  ctx.fillStyle = color;
  var isFirst = true;

  var coordinates = unpackMultiPolCoords(features);
  coordinates.forEach(function(coords) {
    coords.forEach(function(coord) {
      isFirst = drawLine(ctx, coord, isFirst);
    });
    isFirst = true;
    ctx.closePath();
    ctx.fill();
  });

  ctx.closePath();
  ctx.fill();
};

var drawPolygon = function(ctx, features, color) {
  ctx.fillStyle = color;
  var isFirst = true;

  turf.meta.featureEach(features, function(feature) {
    turf.meta.coordEach(feature, function(coord) {
      isFirst = drawLine(ctx, coord, isFirst);
    });
  });

  ctx.closePath();
  ctx.fill();
};

var drawPoint = function(ctx, features, color, lineWidth) {
  // console.log('point feautes', features);
  var point = features.geometry.coordinates;
  var pixel = mercator.posToPixel(point);
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.arc(pixel.x, pixel.y, lineWidth, 0, (Math.PI/180)*360, false);
  ctx.stroke();
  ctx.closePath();

  // fill circle
  ctx.fill();
};

var drawRoute = function(ctx, route, color) {
  var routeLength = route.features.length;
  var length = 1;
  var isFirst = true;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalCompositeOperation = 'destination-over';

  turf.meta.featureEach(route, function(point) {
    var coord = turf.invariant.getCoord(point);
    isFirst = drawLine(ctx, coord, isFirst, true);
    if(routeLength === length) ctx.closePath();
    length++;
  });
};

exports.drawPoint = drawPoint;
exports.drawPolygon = drawPolygon;
exports.drawMultiPolygon = drawMultiPolygon;
exports.drawRoute = drawRoute;
