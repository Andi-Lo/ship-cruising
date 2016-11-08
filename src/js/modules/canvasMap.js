'use strict';

var options = require('./options');
var rgb2hex = require('rgb2hex');
var astar = require('./astar');

var canvas;
var isFirst = true;
var firstClick = {};
var clickCount = 0;
var colorData;
var defaults = options.defaults;

var createMap = function(width, height) {
  canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  canvas.addEventListener('click', function(evt) {
    getMousePosition(canvas, evt);
  }, false);

  canvas.addEventListener('click', function(evt) {
    calcRoute(canvas, evt);
  }, false);

  canvas.addEventListener('click', function(evt) {
    if(isFirst) isFirst = createPixelData(canvas, evt);
  }, false);

  canvas.addEventListener('mousemove', function(evt) {
    updateVal(canvas, evt);
  }, false);

  return canvas;
};

var updateVal = function(canvas, event) {
  var coord = document.getElementById('coordinates');
  var pos = getMousePosition(canvas, event);
  // console.log(pos[0], pos);
  coord.innerHTML = 'x: ' + pos.x + ' y: ' + pos.y;
};

var calcRoute = function(canvas, event) {
  var pos = getMousePosition(canvas, event);
  var ctx = canvas.getContext('2d');
  var color = ctx.getImageData(pos.x, pos.y, 1, 1);
  var hex = rgb2hex('rgba(' + color.data +')');

  ++clickCount;
  if(clickCount % 2 == 1) {
    console.log('first click at:', pos.x, pos.y, 'color:', hex);
    firstClick.x = pos.x;
    firstClick.y = pos.y;
  };

  if(clickCount % 2 == 0) {
    console.log('2nd click at:', pos.x, pos.y, 'color:', hex);
    astar(canvas, colorData, pos.x, pos.y, firstClick);
  }
};

var getMousePosition = function(canvas, event) {
  var rectangle = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rectangle.left,
    y: event.clientY - rectangle.top
  };
};

function drawPixels(ctx, colorData) {
  ctx.fillStyle = 'rgba(670, 160, 50, 0.8)';
  ctx.globalCompositeOperation = 'destination-over';

  for(var x = 0; x < defaults.height; x++) {
    for(var y = 0; y < defaults.width; y++) {
      if(colorData[x][y] !== 0) ctx.fillRect(x, y, 1, 1);
    }
  }
};

var createPixelData = function(canvas) {
  var ctx = canvas.getContext('2d');
  colorData = new Array(defaults.height);
  for (var i = 0; i < defaults.height; i++) {
    colorData[i] = new Array(defaults.width);
  }

  for(var x = 0; x < defaults.height; x++) {
    for(var y = 0; y < defaults.width; y++) {
      var color = ctx.getImageData(x, y, 1, 1);
      var hex = rgb2hex('rgba(' + color.data +')');
      colorData[x][y] = hex.hex === '#303030' ? 1 : 0;
    }
  }
  console.log('data', colorData);
  drawPixels(ctx, colorData);
  return false;
};

var getCanvas = function() {
  return canvas;
};

module.exports.createPixelData = createPixelData;
module.exports.getCanvas = getCanvas;
module.exports.createMap = createMap;
