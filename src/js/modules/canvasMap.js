'use strict';

let CanvasObserver = require('../observers/canvasObserver').CanvasObserver;
let defaults = require('./options').defaults;
// let dilate = require('../libs/dilate');
let drawCanvas = require('./drawCanvas');
let drawLeaflet = require('./drawLeaflet');
let erode = require('../libs/erode');
let mercator = require('../libs/mercator');
let turf = require('../libs/turf');
let forces = require('../forces/forces');
let tolineString = require('../libs/to-lineString');
let Route = require('./route').Route;
let Land = require('./land').Land;

let canvas;
let colorData = [];

let createCanvas = function(width, height) {
  let el = window.document.getElementById('ship-cruising');
  canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'sc_canvas');
  canvas.width = width;
  canvas.height = height;

  // new CanvasObserver(canvas);
  drawCanvas.drawRect(defaults.mapBg, defaults.width, defaults.height);
  el.appendChild(canvas);

  return canvas;
};

let initMap = function(fcMap, fcRoute, bbox) {
  // drawCanvas.clearCanvas();
  createCanvas(defaults.width, defaults.height);
  fcMap = turf.clipPolygon(fcMap, bbox);
  fcMap.features.forEach((features) => {
    switch (features.geometry.type) {
      case "LineString":
        drawCanvas.drawLineString(features, defaults.mapColor, true, 0.1);
        break;
      default:
        console.log(features.geometry.type);
        break;
    }
  });
  // Draw black circle over the harbor points.
  // drawCanvas.drawPoint(fcRoute, '#000000', 2);
  // Draw a black frame around the bbox
  // drawCanvas.drawRectBox(bbox, '#000000', 4);

  return fcMap;
};

let updateVal = function(event) {
  let coord = document.getElementById('coordinates');
  let pos = getMousePosition(event);
  pos = mercator.pixelToPos([pos.x, pos.y]);
  coord.innerHTML = 'x: ' + pos.x + ' y: ' + pos.y;
};

let getMousePosition = function(event) {
  let canvas = getCanvas();
  let rectangle = canvas.getBoundingClientRect();
  return {
    x: Math.floor(event.clientX - rectangle.left),
    y: Math.floor(event.clientY - rectangle.top)
  };
};

/**
 * Creates a 2D binary array of the canvas that will serve us as a
 * per pixel based look-up-table for land and water.
 * If the color lookup leads to a 1 it is water
 * If the color lookup leads to a 0 it is land
 * @returns a 2D binary array
 */
let createPixelData = function() {
  let ctx = getCanvas().getContext('2d');
  let imageData = ctx.getImageData(0, 0, defaults.width, defaults.height);
  let colorData = [];
  let rowIndex = 0;
  let isFirst = true;
  let binaryValue;

  for(let i = 0; i < imageData.data.length; i += 4) {
    binaryValue = (imageData.data[i] !== 0) ? 1000 : 1;
    if(isFirst)
      colorData.push([binaryValue]);
    else
      colorData[rowIndex].push(binaryValue);

    rowIndex++;
    if(rowIndex === defaults.height) {
      isFirst = false;
      rowIndex = 0;
    }
  }
  colorData = erode(colorData, defaults.width, defaults.height, 7);
  setColorData(colorData);
  return colorData;
};

let colorToObject = function(rgbaString) {
  rgbaString = rgbaString.substring(5, rgbaString.length-1)
      .replace(/ /g, '')
      .split(',');
  return {
    'r': parseFloat(rgbaString[0]),
    'g': parseFloat(rgbaString[1]),
    'b': parseFloat(rgbaString[2]),
    'a': parseFloat(rgbaString[3])
  };
};

let updateMap = function(fcRoute, fcMap) {
  clearCanvasDiv();
  let route = new Route(fcRoute, fcMap);

  drawLeaflet.drawPolyline(route._route, defaults.routeColor, 1);
  drawLeaflet.drawMarkers(route._waypoints);

  // let land = new Land(tolineString(fcMap));
  // let simulation = forces.force(route._route, land._equidistantPoints);
  // new ForceObserver(simulation);
};

let getCanvas = function() {
  return canvas;
};

function clearCanvasDiv() {
  let el = window.document.getElementById('ship-cruising');
  while(el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

function setColorData(data) {
  colorData = data;
};

let getColorData = function(start, end, fcMap) {
  let fcRoute = turf.featureCollection([start, end]);
  let bbox = turf.square(turf.calcBbox(fcRoute));
  let origin = mercator.getOrigin(bbox);
  bbox = turf.size(bbox, Math.floor(origin.zoom / 4));
  defaults.bbox = bbox;
  initMap(fcMap, fcRoute, bbox);
  setColorData(createPixelData());

  return colorData;
};

module.exports.createPixelData = createPixelData;
module.exports.getMousePosition = getMousePosition;
module.exports.getCanvas = getCanvas;
module.exports.getColorData = getColorData;
module.exports.createCanvas = createCanvas;
module.exports.initMap = initMap;
module.exports.updateVal = updateVal;
module.exports.updateMap = updateMap;
