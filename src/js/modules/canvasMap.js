'use strict';

let defaults = require('./options').defaults;
let turf = require('../libs/turf');
let rgb2hex = require('rgb2hex');
let mercator = require('../libs/mercator');
let erode = require('../libs/erode');
let draw = require('./drawCanvas');
let CanvasObserver = require('../observers/canvasObserver').CanvasObserver;

let canvas;
let colorData;
let features = [];

let createMap = function(width, height) {
  let el = window.document.getElementById('ship-cruising');
  canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'sc_canvas');
  canvas.width = width;
  canvas.height = height;

  new CanvasObserver(canvas);

  el.appendChild(canvas);
  return canvas;
};

let init = function(path) {
  fetch(path).then((parse) => parse.json()).then((geo) => {
    geo.features.forEach((features) => {
      switch (features.geometry.type) {
        case "Polygon":
          draw.drawPolygon(features, defaults.mapColor);
          break;

        case "Point":
          draw.drawPoint(features, defaults.pointColor, 4);
          break;

        case "MultiPolygon":
          draw.drawMultiPolygon(features, defaults.mapColor);
          break;

        default:
          console.log(features.geometry.type);
          break;
      }
    });
    createPixelData(canvas);
    let dist = mercator.calcScale('kilometers');
    setScale(dist);
  });
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
  colorData = erode(colorData, defaults.width, defaults.height, 5);
  return colorData;
};

let getCanvas = function() {
  return canvas;
};

let getFeatures = function() {
  return features;
};

let setFeatures = function(val) {
  features = val;
};

let getColorData = function() {
  return colorData;
};

module.exports.createPixelData = createPixelData;
module.exports.getMousePosition = getMousePosition;
module.exports.getCanvas = getCanvas;
module.exports.getColorData = getColorData;
module.exports.getFeatures = getFeatures;
module.exports.createMap = createMap;
module.exports.setScale = setScale;
module.exports.setFeatures = setFeatures;
module.exports.init = init;
module.exports.updateVal = updateVal;
module.exports.registerClick = registerClick;
