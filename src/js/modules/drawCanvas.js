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

let drawLine = function(ctx, coord, isFirst, stroke = false) {
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

function setCanvasProps(ctx, props) {
  ctx.lineWidth = props.lineWidth;
  ctx.strokeStyle = props.fillStyle;
  ctx.fillStyle = props.fillStyle;
  ctx.lineCap = props.lineCap === undefined ? 'butt' : props.lineCap;
  ctx.imageSmoothingEnabled = false;
}

let drawLineString = function(fc, color, fill = false, lineWidth, lineCap) {
  let ctx = canvasMap.getCanvas().getContext('2d');
  let length = 1;
  let isFirst = true;
  setCanvasProps(ctx, {
    'lineWidth': lineWidth,
    'fillStyle': color,
    'strokeStyle': color,
    'lineCap': lineCap
  });

  turf.meta.featureEach(fc, function(feature) {
    let routeLength = feature.geometry.coordinates.length;
    turf.meta.coordEach(feature, function(coord) {
      isFirst = drawLine(ctx, coord, isFirst, true);
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

let drawRect = function(color, width, height) {
  let ctx = canvasMap.getCanvas().getContext('2d');

  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

exports.drawPixels = drawPixels;
exports.drawLineString = drawLineString;
exports.drawRect = drawRect;
exports.clearCanvas = clearCanvas;
