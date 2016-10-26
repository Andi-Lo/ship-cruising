'use strict';

var posToPixel = require('./positionToPixel');

var drawPolygon = function(ctx, polygon, color) {
  ctx.fillStyle = color;

  var i = 0;

  polygon.forEach((coord) => {
    coord.forEach((longlat) => {
      var pixel = posToPixel(longlat);

      if(pixel.x > 0 || pixel.y > 0) {
        if(i === 0) {
          i++;
          ctx.beginPath();
          ctx.moveTo(pixel.x, pixel.y);
        }
        else {
          ctx.lineTo(pixel.x, pixel.y);
        }
      }
    });
  });

  i = 0;
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
  ctx.arc(pixel.x, pixel.y, 5, (Math.PI/180)*0, (Math.PI/180)*360, false);
  ctx.stroke();
  ctx.closePath();

  // draw full circle
  ctx.fill();
};

var drawRoute = function(ctx, points, color, route) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.globalCompositeOperation='destination-over';

  var pixel = posToPixel(points);

  if(pixel.x > 0 && pixel.y > 0) {
    if(route.iterator === 0) {
      ctx.beginPath();
      ctx.moveTo(pixel.x, pixel.y);
    }
    else {
      ctx.lineTo(pixel.x, pixel.y);
      ctx.stroke();
    }
  }
  if(route.iterator === route.length) {
    ctx.closePath();
  }
};

exports.drawPoint = drawPoint;
exports.drawPolygon = drawPolygon;
exports.drawRoute = drawRoute;
