'use strict';

let defaults = require('./options').defaults;
let drawCanvas = require('./drawCanvas');
let drawLeaflet = require('./drawLeaflet');
let mercator = require('../libs/mercator');
let turf = require('../libs/turf');
let Route = require('./route').Route;
let blur = require('ctx-blur');
let toLineString = require('../libs/to-lineString');

let canvas;
let colorData = [];
const ITERATIONS = 4;

let createCanvas = function(width, height) {
  let el = window.document.getElementById('ship-cruising');
  canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'sc_canvas');
  canvas.width = width;
  canvas.height = height;

  drawCanvas.drawRect(defaults.mapBg, defaults.width, defaults.height);
  el.appendChild(canvas);

  return canvas;
};

function getStrokeSize(x) {
  switch (x) {
    case 1:
      return 6;
    case 2:
      return 3;
    case 3:
      return 0.1;
    default:
      break;
  }
}

/**
 * Create grey-scales values between 0 and 255
 *
 * @param {number} iterator
 * @param {number} iterations
 * @returns
 */
function getRgba(i, iterations) {
  let rgb = Math.floor( (255 / (iterations-1)) * i );
  return `rgba(${rgb}, ${rgb}, ${rgb}, 1)`;
}

function canvasBlur(canvas) {
  blur({radius: 2})(canvas, function(err, newCanvas) {
  });
}

function updateMap(fcMap, bbox) {
  let canvas = createCanvas(defaults.width, defaults.height);
  fcMap = toLineString(turf.getPolygons(fcMap, bbox));
  let lineCap = 'square';
  // draw grey-scale map with different stroke sizes
  for(let i = 1; i < ITERATIONS; i++) {
    let sSize = getStrokeSize(i);
    let rgba = getRgba(i, ITERATIONS);
    console.log('Calculating canvas ' + i + ' of ' + (ITERATIONS-1));
    fcMap.features.forEach((features) => {
      switch (features.geometry.type) {
        case "LineString":
          if(i === ITERATIONS-1)
            lineCap = 'butt';
          drawCanvas.drawLineString(features, rgba, true, sSize, lineCap);
          break;
        default:
          console.log(features.geometry.type);
          break;
      }
    });
    // blur the canvas befor painting the land on the last iteration
    if(i === ITERATIONS-2)
      canvasBlur(canvas);
  }
  return fcMap;
};

/**
 * Creates a 2D array of the canvas that will serve us as a
 * per pixel based look-up-table for land and water.
 *
 * @returns {Array<Array>} a 2D binary array
 */
let createPixelData = function() {
  let ctx = getCanvas().getContext('2d');
  let imageData = ctx.getImageData(0, 0, defaults.width, defaults.height);
  let colorData = [];
  let rowIndex = 0;
  let isFirst = true;
  let weight;

  for(let i = 0; i < imageData.data.length; i += 4) {
    if(imageData.data[i] === 0) {
      weight = 1;
    }
    else if(imageData.data[i] > 250) {
      weight = imageData.data[i] * Math.pow(imageData.data[i], 3);
    }
    else {
      weight = Math.ceil(imageData.data[i] * Math.log2(imageData.data[i])/100);
      if(weight <= 0) weight = 1;
    }
    if(isFirst)
      colorData.push([weight]);
    else
      colorData[rowIndex].push(weight);

    rowIndex++;
    if(rowIndex === defaults.height) {
      isFirst = false;
      rowIndex = 0;
    }
  }
  setColorData(colorData);
  return colorData;
};

let initMap = function(fcRoute, fcMap) {
  clearCanvasDiv();
  console.time('Time for Calculation');
  let route = new Route(fcRoute, fcMap);
  console.timeEnd('Time for Calculation');

  drawLeaflet.drawPolyline(route._route);
  drawLeaflet.drawMarkers(route._waypoints);
  return 'Done!';
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
  bbox = turf.size(bbox, Math.floor(origin.zoom / 3));
  defaults.bbox = bbox;
  updateMap(fcMap, bbox);
  setColorData(createPixelData());

  return colorData;
};

module.exports.createPixelData = createPixelData;
module.exports.getCanvas = getCanvas;
module.exports.getColorData = getColorData;
module.exports.createCanvas = createCanvas;
module.exports.initMap = initMap;
