'use strict';

let options = require('./options');
let turf = require('./turf');
let rgb2hex = require('rgb2hex');
let pathfinding = require('./pathfinding');
let mercator = require('./mercator');
let draw = require('./draw');

let canvas;
let start = {};
let clickCount = 0;
let colorData;
let features = [];
let defaults = options.defaults;

let createMap = function(width, height) {
  canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  canvas.addEventListener('click', function(evt) {
    getMousePosition(canvas, evt);
  }, false);

  canvas.addEventListener('click', function(evt) {
    registerClick(canvas, evt);
  }, false);

  canvas.addEventListener('mousemove', function(evt) {
    updateVal(canvas, evt);
  }, false);

  window.addEventListener("keydown", function(event) {
    if(event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
      case "Enter":
        try {
          calcRoute(canvas, event);
        }
        catch(e) {
          throw e;
        }
        finally {
          features = [];
        }
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true);

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

let registerClick = function(canvas, event) {
  let pixelPos = getMousePosition(canvas, event);
  let point = mercator.pixelToPos([pixelPos.x, pixelPos.y]);
  point = turf.point([point.x, point.y], {name: 'Point', pixelPos: pixelPos}),
  features.push(point);
};

let calcRoute = function(canvas, event) {
  let fc = turf.featureCollection(features);
  let routes = pathfinding(canvas, colorData, fc);
  draw.drawLineString(canvas, routes);
  draw.drawPixels(canvas, routes);
  features = [];
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
      colorData[x][y] = hex.hex === defaults.mapColor ? 0 : 1;
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
