'use strict';

let mercator = require('../libs/mercator');
let turf = require('../libs/turf');
let defaults = require('./options').defaults;
let canvasMap = require('./canvasMap');

let drawLine = function(coord, isFirst, stroke = false) {
  let canvas = canvasMap.getCanvas();
  let ctx = canvas.getContext('2d');
  let pixel = mercator.posToPixel(coord);

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

let drawMultiPolygon = function(features, color) {
  let canvas = canvasMap.getCanvas();
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  let isFirst = true;

  let coordinates = turf.unpackMultiPolCoords(features);
  coordinates.forEach(function(coords) {
    coords.forEach(function(coord) {
      isFirst = drawLine(coord, isFirst);
    });
    isFirst = true;
    ctx.closePath();
    ctx.fill();
  });
  ctx.closePath();
  ctx.fill();
};

let drawPolygon = function(features, color) {
  ctx.fillStyle = color;
  let isFirst = true;

  turf.meta.featureEach(features, function(feature) {
    turf.meta.coordEach(feature, function(coord) {
      isFirst = drawLine(coord, isFirst);
    });
  });

  ctx.closePath();
  ctx.fill();
};

let drawPoint = function(ctx, features, color, lineWidth) {
  let point = features.geometry.coordinates;
  let pixel = mercator.posToPixel(point);
  // ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.arc(pixel.x, pixel.y, lineWidth, 0, (Math.PI/180)*360, false);
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
};

let drawPixels = function(featureCollection) {
  let canvas = canvasMap.getCanvas();
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = defaults.pixelColor;

  turf.meta.featureEach(featureCollection, function(feature) {
    turf.meta.coordEach(feature, function(coord) {
      let pixel = mercator.posToPixel(coord);
      ctx.fillRect(pixel.x, pixel.y, 4, 4);
    });
  });
};

let drawMultiLineString = function(fc) {
  console.log('drawMultiLineString', fc);
  turf.meta.coordEach(fc, function(coord) {
  });
};

let drawLineString = function(fc, color, lineWidth = 2, fill = false) {
  console.log('fc', fc);
  let ctx = canvasMap.getCanvas().getContext('2d');
  let length = 1;
  let isFirst = true;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  turf.meta.featureEach(fc, function(feature) {
    let routeLength = feature.geometry.coordinates.length;
    turf.meta.coordEach(feature, function(coord) {
      isFirst = drawLine(coord, isFirst, true);
      if(routeLength === length) ctx.closePath();
      length++;
    });
    length = 1;
    isFirst = true;
    ctx.closePath();
    if(fill == true) {
      ctx.fill();
    }
  });
  ctx.closePath();
  if(fill == true) {
    ctx.fill();
  }
};

let drawRoute = function(ctx, route, color) {
  let routeLength = route.features.length;
  let length = 1;
  let isFirst = true;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalCompositeOperation = 'destination-over';

  turf.meta.featureEach(route, function(point) {
    let coord = turf.invariant.getCoord(point);
    isFirst = drawLine(coord, isFirst, true);
    if(routeLength === length) ctx.closePath();
    length++;
  });
};

let drawRect = function(color, width, height) {
  let canvas = canvasMap.getCanvas();
  let ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

exports.drawPoint = drawPoint;
exports.drawPolygon = drawPolygon;
exports.drawMultiPolygon = drawMultiPolygon;
exports.drawRoute = drawRoute;
exports.drawPixels = drawPixels;
exports.drawLineString = drawLineString;
exports.drawMultiLineString = drawMultiLineString;
exports.drawRect = drawRect;
