'use strict';

let defaults = require('./options').defaults;
let turf = require('./turf');
let rgb2hex = require('rgb2hex');
let mercator = require('./mercator');
let erode = require('./erode');
let Route = require('./route').Route;

let canvas;
let colorData;
let features = [];

let createMap = function(width, height) {
  canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'sc_canvas');
  canvas.width = width;
  canvas.height = height;

  canvas.addEventListener('click', function(evt) {
    getMousePosition(evt);
  }, false);

  canvas.addEventListener('click', function(evt) {
    registerClick(evt);
  }, false);

  canvas.addEventListener('mousemove', function(evt) {
    updateVal(evt);
  }, false);

  window.addEventListener("keydown", function(event) {
    if(event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
      case "Enter":
        try {
          new Route(features);
          features = [];
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

let updateVal = function(event) {
  let coord = document.getElementById('coordinates');
  let pos = getMousePosition(event);
  coord.innerHTML = 'x: ' + pos.x + ' y: ' + pos.y;
};

let setScale = function(scale, units = 'kilometers') {
  let el = document.getElementById('scale');
  if(units === 'kilometers') units = 'km';
  el.innerHTML = '1px = ' + scale + ' ' + units;
};

let registerClick = function(event) {
  let pixelPos = getMousePosition(event);
  let point = mercator.pixelToPos([pixelPos.x, pixelPos.y]);
  point = turf.point(
      [point.x, point.y],
      {name: 'harbour'}
  );
  features.push(point);
};

let getMousePosition = function(event) {
  let rectangle = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rectangle.left,
    y: event.clientY - rectangle.top
  };
};

let createPixelData = function() {
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
  colorData = erode(colorData, defaults.width, defaults.height);
  return colorData;
};

let getCanvas = function() {
  return canvas;
};

let getColorData = function() {
  return colorData;
};

module.exports.createPixelData = createPixelData;
module.exports.getCanvas = getCanvas;
module.exports.getColorData = getColorData;
module.exports.createMap = createMap;
module.exports.setScale = setScale;
