'use strict';

let mercator = require('./mercator');
let turf = require('./turf');

let unpackMultiPolCoords = function(features) {
  let data = [];

  turf.meta.featureEach(features, function(feature) {
    let coordCollection = feature.geometry.coordinates;
    coordCollection.forEach(function(coords) {
      coords.forEach(function(coord) {
        data.push(coord);
      });
    });
  });
  return data;
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

let drawPixels = function(canvas, path, color = 'rgba(50, 200, 0, 0.8)') {
  let ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = color;

  path.forEach((point) => {
    let pixel = mercator.posToPixel(point);
    ctx.fillRect(pixel.x, pixel.y, 4, 4);
  });
};

let drawMultiPolygon = function(ctx, features, color) {
  ctx.fillStyle = color;
  let isFirst = true;

  let coordinates = unpackMultiPolCoords(features);
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

let drawPolygon = function(ctx, features, color) {
  ctx.fillStyle = color;
  let isFirst = true;

  turf.meta.featureEach(features, function(feature) {
    turf.meta.coordEach(feature, function(coord) {
      isFirst = drawLine(ctx, coord, isFirst);
    });
  });

  ctx.closePath();
  ctx.fill();
};

let drawPoint = function(ctx, features, color, lineWidth) {
  // console.log('point feautes', features);
  let point = features.geometry.coordinates;
  let pixel = mercator.posToPixel(point);
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

let drawLineString = function(canvas, lineStringFeature) {
  let routeLength = lineStringFeature.geometry.coordinates.length;
  let ctx = canvas.getContext('2d');
  let length = 1;
  let isFirst = true;
  ctx.fillStyle = 'rgba(670, 160, 50, 0.8)';
  ctx.strokeStyle = 'rgba(670, 160, 50, 0.8)';
  ctx.lineWidth = 2;
  ctx.globalCompositeOperation = 'destination-over';

  turf.meta.coordEach(lineStringFeature, function(coord) {
    isFirst = drawLine(ctx, coord, isFirst, true);
    if(routeLength === length) ctx.closePath();
    length++;
  });
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
    isFirst = drawLine(ctx, coord, isFirst, true);
    if(routeLength === length) ctx.closePath();
    length++;
  });
};

exports.drawPoint = drawPoint;
exports.drawPolygon = drawPolygon;
exports.drawMultiPolygon = drawMultiPolygon;
exports.drawRoute = drawRoute;
exports.drawPixels = drawPixels;
exports.drawLineString = drawLineString;
