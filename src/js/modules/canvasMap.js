'use strict';

let options = require('./options');
let rgb2hex = require('rgb2hex');
let pathfinding = require('./pathfinding');

let canvas;
let start = {};
let clickCount = 0;
let colorData;
let defaults = options.defaults;

let createMap = function(width, height) {
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

let updateVal = function(canvas, event) {
  let coord = document.getElementById('coordinates');
  let pos = getMousePosition(canvas, event);
  coord.innerHTML = 'x: ' + pos.x + ' y: ' + pos.y;
};

let setScale = function(scale, units = 'kilometers') {
  let el = document.getElementById('scale');
  el.innerHTML = '1px is: ' + scale + ' ' + units;
};

let calcRoute = function(canvas, event) {
  let end = getMousePosition(canvas, event);
  let ctx = canvas.getContext('2d');
  let color = ctx.getImageData(end.x, end.y, 1, 1);
  let hex = rgb2hex('rgba(' + color.data +')');

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

let getMousePosition = function(canvas, event) {
  let rectangle = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rectangle.left,
    y: event.clientY - rectangle.top
  };
};

let createPixelData = function(canvas) {
  let ctx = canvas.getContext('2d');
  colorData = new Array(defaults.height);
  for (let i = 0; i < defaults.height; i++) {
    colorData[i] = new Array(defaults.width);
  }

  for(let x = 0; x < defaults.height; x++) {
    for(let y = 0; y < defaults.width; y++) {
      let color = ctx.getImageData(x, y, 1, 1);
      let hex = rgb2hex('rgba(' + color.data +')');
      colorData[x][y] = hex.hex === '#303030' ? 0 : 1;
    }
  }
  return false;
};

let getCanvas = function() {
  return canvas;
};

module.exports.createPixelData = createPixelData;
module.exports.getCanvas = getCanvas;
module.exports.createMap = createMap;
module.exports.setScale = setScale;
