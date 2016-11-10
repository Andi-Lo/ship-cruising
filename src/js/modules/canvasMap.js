'use strict';

var options = require('./options');
var rgb2hex = require('rgb2hex');
var pathfinding = require('./pathfinding');

var canvas;
var start = {};
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

  canvas.addEventListener('mousemove', function(evt) {
    updateVal(canvas, evt);
  }, false);

  return canvas;
};

var updateVal = function(canvas, event) {
  var coord = document.getElementById('coordinates');
  var pos = getMousePosition(canvas, event);
  coord.innerHTML = 'x: ' + pos.x + ' y: ' + pos.y;
};

var setScale = function(scale, units = 'kilometers') {
  var el = document.getElementById('scale');
  el.innerHTML = '1px is: ' + scale + ' ' + units;
};

var calcRoute = function(canvas, event) {
  var end = getMousePosition(canvas, event);
  var ctx = canvas.getContext('2d');
  var color = ctx.getImageData(end.x, end.y, 1, 1);
  var hex = rgb2hex('rgba(' + color.data +')');

  ++clickCount;
  if(clickCount % 2 == 1) {
    console.log('first click at:', end.x, end.y, 'color:', hex);
    start.x = end.x;
    start.y = end.y;
  };

  if(clickCount % 2 == 0) {
    console.log('2nd click at:', end.x, end.y, 'color:', hex);
    pathfinding(canvas, colorData, end, start);
  }
};

var getMousePosition = function(canvas, event) {
  var rectangle = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rectangle.left,
    y: event.clientY - rectangle.top
  };
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
      colorData[x][y] = hex.hex === '#303030' ? 0 : 1;
    }
  }
  return false;
};

var getCanvas = function() {
  return canvas;
};

module.exports.createPixelData = createPixelData;
module.exports.getCanvas = getCanvas;
module.exports.createMap = createMap;
module.exports.setScale = setScale;
