'use strict';

var posToPixel = require('./positionToPixel');
var turf = require('./turf');

// todo
var drawMultiPolygon = function(ctx, featureCollection, color) {
  // console.log('featureCollection', featureCollection);
  ctx.fillStyle = color;
  var isFirst = true;

  turf.meta.coordEach(featureCollection, function(coord) {
    var pixel = posToPixel(coord);

    if(pixel.x > 0 || pixel.y > 0) {
      if(isFirst === true) {
        ctx.beginPath();
        ctx.moveTo(pixel.x, pixel.y);
        isFirst = false;
      }
      else {
        ctx.lineTo(pixel.x, pixel.y);
      }
    }
  });

  isFirst = true;
  ctx.closePath();
  ctx.fill();
};

var drawPolygon = function(ctx, feature, color) {
  // console.log('feature', feature);
  ctx.fillStyle = color;

  var isFirst = true;

  turf.meta.coordEach(feature, function(coord) {
    var pixel = posToPixel(coord);

    if(pixel.x > 0 || pixel.y > 0) {
      if(isFirst === true) {
        ctx.beginPath();
        ctx.moveTo(pixel.x, pixel.y);
        isFirst = false;
      }
      else {
        ctx.lineTo(pixel.x, pixel.y);
      }
    }
  });

  isFirst = true;
  ctx.closePath();
  ctx.fill();
};

var drawPoint = function(ctx, point, color, lineWidth) {
  // make points visible
  ctx.globalCompositeOperation='destination-over';

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  var pixel = posToPixel(point);

  ctx.beginPath();
  ctx.arc(pixel.x, pixel.y, lineWidth, 0, (Math.PI/180)*360, false);
  ctx.stroke();
  ctx.closePath();

  // draw full circle
  ctx.fill();
};

var drawRoute = function(ctx, route, color, fill = false) {
  // console.log('route', route);
  var length = route.features.length;
  var isFirst = true;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalCompositeOperation = 'destination-over';

  turf.meta.featureEach(route, function(point) {
    // console.log("point", point);
    var coord = turf.invariant.getCoord(point);
    // console.log("coord", coord);
    var pixel = posToPixel(coord);
    // console.log("pixel", pixel);

    if(pixel.x > 0 && pixel.y > 0) {
      if(isFirst === true) {
        ctx.beginPath();
        ctx.moveTo(pixel.x, pixel.y);
        isFirst = false;
      }
      else {
        ctx.lineTo(pixel.x, pixel.y);
        ctx.stroke();
      }
    }
    if(isFirst === length) {
      ctx.closePath();
    }
  });
  fill === true ? ctx.fill() : '';
};

exports.drawPoint = drawPoint;
exports.drawPolygon = drawPolygon;
exports.drawMultiPolygon = drawMultiPolygon;
exports.drawRoute = drawRoute;
