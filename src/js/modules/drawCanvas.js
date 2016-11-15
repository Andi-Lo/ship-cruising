'use strict';

let mercator = require('./mercator');
let turf = require('./turf');
let drawLeaflet = require('./drawLeaflet');
let defaults = require('./options').defaults;

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
  ctx.fill();
};

let drawPixels = function(canvas, featureCollection) {
  let ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = defaults.pixelColor;

  turf.meta.featureEach(featureCollection, function(feature) {
    turf.meta.coordEach(feature, function(coord) {
      let pixel = mercator.posToPixel(coord);
      ctx.fillRect(pixel.x, pixel.y, 4, 4);
    });
  });
};

let drawLineString = function(canvas, featureCollection) {
  let ctx = canvas.getContext('2d');
  let length = 1;
  let isFirst = true;
  ctx.fillStyle = defaults.strokeColor;
  ctx.strokeStyle = defaults.strokeColor;
  ctx.lineWidth = 2;
  ctx.globalCompositeOperation = 'destination-over';

  turf.meta.featureEach(featureCollection, function(feature) {
    // Draw LineString(Polyline) in Leaflet
    drawLeaflet.drawPolyline(feature);

    let routeLength = feature.geometry.coordinates.length;
    turf.meta.coordEach(feature, function(coord) {
      isFirst = drawLine(ctx, coord, isFirst, true);
      if(routeLength === length) ctx.closePath();
      length++;
    });
    length = 1;
    isFirst = true;
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
