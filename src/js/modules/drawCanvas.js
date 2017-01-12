'use strict';

let mercator = require('../libs/mercator');
let turf = require('../libs/turf');
let defaults = require('./options').defaults;
let canvasMap = require('./canvasMap');

let clearCanvas = function() {
  let ctx = canvasMap.getCanvas().getContext('2d');
  ctx.clearRect(0, 0, defaults.width, defaults.height);
  drawRect(defaults.mapBg, defaults.width, defaults.height);
};

let drawLine = function(coord, isFirst, stroke = false) {
  let ctx = canvasMap.getCanvas().getContext('2d');
  let pixel = mercator.posToPixel(coord);

  if(pixel.x > 0 || pixel.y > 0) {
    if(isFirst === true) {
      ctx.imageSmoothingEnabled = false;
      ctx.lineCap = "square";
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
  let ctx = canvasMap.getCanvas().getContext('2d');
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

let drawPoint = function(fc, color, lineWidth) {
  let ctx = canvasMap.getCanvas().getContext('2d');

  turf.meta.coordEach(fc, function(point) {
    let pixel = mercator.posToPixel(point);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.arc(pixel.x, pixel.y, lineWidth, 0, (Math.PI/180)*360, false);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
  });
};

let drawPixels = function(featureCollection) {
  let ctx = canvasMap.getCanvas().getContext('2d');
  ctx.fillStyle = defaults.pixelColor;

  turf.meta.featureEach(featureCollection, function(feature) {
    turf.meta.coordEach(feature, function(coord) {
      let pixel = mercator.posToPixel(coord);
      ctx.fillRect(pixel.x, pixel.y, 2, 2);
    });
  });
};

let drawLineString = function(fc, color, fill = false, lineWidth) {
  let ctx = canvasMap.getCanvas().getContext('2d');
  let length = 1;
  let isFirst = true;
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  turf.meta.featureEach(fc, function(feature) {
    let routeLength = feature.geometry.coordinates.length;
    turf.meta.coordEach(feature, function(coord) {
      isFirst = drawLine(coord, isFirst, true);
      if(routeLength === length) ctx.closePath();
      length++;
    });
    length = 1;
    isFirst = true;
  });
  ctx.closePath();
  if(fill == true) {
    ctx.fill();
  }
};

let drawRoute = function(route, color) {
  let ctx = canvasMap.getCanvas().getContext('2d');
  let routeLength = route.features.length;
  let length = 1;
  let isFirst = true;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalCompositeOperation = 'destination-over';

  turf.meta.featureEach(route, function(point) {
    let coord = turf.invariant.getCoord(point);
    isFirst = drawLine(coord, isFirst, true);
    if(routeLength === length) ctx.closePath();
    length++;
  });
};

let drawRect = function(color, width, height) {
  let ctx = canvasMap.getCanvas().getContext('2d');

  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

let drawRectBox = function(bbox, color, lineWidth) {
  let ctx = canvasMap.getCanvas().getContext('2d');
  let pixelStart = mercator.posToPixel([bbox[0], bbox[1]]);
  let pixelEnd = mercator.posToPixel([bbox[2], bbox[3]]);
  let width = pixelEnd.x - pixelStart.x;
  let height = pixelStart.y - pixelEnd.y;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = defaults.mapBg;

  ctx.beginPath();
  ctx.rect(pixelStart.x, pixelEnd.y, width, height);
  ctx.stroke();
  ctx.closePath();
};

exports.drawPoint = drawPoint;
exports.drawPolygon = drawPolygon;
exports.drawMultiPolygon = drawMultiPolygon;
exports.drawRoute = drawRoute;
exports.drawPixels = drawPixels;
exports.drawLineString = drawLineString;
exports.drawRect = drawRect;
exports.clearCanvas = clearCanvas;
exports.drawRectBox = drawRectBox;
