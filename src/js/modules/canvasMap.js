'use strict';

let defaults = require('./options').defaults;
let turf = require('../libs/turf');
turf.size = require('turf-size');
let mercator = require('../libs/mercator');
let erode = require('../libs/erode');
let polygon2line = require('../libs/polygon-to-line');
let draw = require('./drawCanvas');
let CanvasObserver = require('../observers/canvasObserver').CanvasObserver;

let canvas;
let colorData = [];
let features = [];

let createCanvas = function(width, height) {
  let el = window.document.getElementById('ship-cruising');
  canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'sc_canvas');
  canvas.width = width;
  canvas.height = height;

  new CanvasObserver(canvas);
  draw.drawRect(defaults.mapBackgroundColor, defaults.width, defaults.height);
  el.appendChild(canvas);

  return canvas;
};


/**
 * Takes a set of points and a set of polygons and returns
 * the points that fall within the polygons.
 * This function is a modified version of the official turf.within function
 *
 * @param {Array<Points>} points
 * @param {FeatureCollection<Polygon>} polygons
 * @returns FeatureCollection<LineString> with matching points
 */
function within(points, polygons) {
  let pointsWithin = [];
  for (let i = 0; i < polygons.features.length; i++) {
    for (let j = 0; j < points.length; j++) {
      let isInside = turf.inside(points[j], polygons.features[i]);
      if (isInside) {
        pointsWithin.push(points[j]);
      }
    }
  }
  if(pointsWithin.length > 0) {
    return turf.lineString(pointsWithin);
  }
  else {
    return false;
  }
};

function bboxClip(feature, bbox) {
  let points = turf.meta.coordAll(feature);
  let isWithin = within(points, bbox);
  return isWithin;
};

function clip(fc) {
  // expand the bbox size by factor 2
  let bbox = turf.size(defaults.bbox, 1);
  let polygon = turf.featureCollection([turf.bboxPolygon(bbox)]);
  fc = polygon2line(fc);

  let pointsWithin = turf.featureCollection([]);
  let intersection;
  turf.meta.featureEach(fc, function(feature) {
    intersection = bboxClip(feature, polygon);
    if(intersection !== false) {
      pointsWithin.features.push(intersection);
    }
  });
  return pointsWithin;
}

let initMap = function(path) {
  return new Promise(function(resolve, reject) {
    fetch(path).then((parse) => parse.json()).then((geo) => {
      // return the relevant map points that lay in the viewport
      geo = clip(geo);
      // resolve promise object with the map data
      resolve(geo);
      geo.features.forEach((features) => {
        switch (features.geometry.type) {
          case "LineString":
            draw.drawLineString(features, defaults.mapColor, true, 1);
            break;
          default:
            console.log(features.geometry.type);
            break;
        }
      });
    });
  });
};

let updateVal = function(event) {
  let coord = document.getElementById('coordinates');
  let pos = getMousePosition(event);
  coord.innerHTML = 'x: ' + pos.x + ' y: ' + pos.y;
};

let setScale = function(units = 'kilometers') {
  let scale = mercator.calcScale(units);
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
  let canvas = getCanvas();
  let ctx = canvas.getContext('2d');
  let imageData = ctx.getImageData(0, 0, defaults.width, defaults.height);
  let mapColor = colorToObject(defaults.mapColor);

  let colorData = [];
  let rowIndex = 0;
  let isFirst = true;
  for(let i = 0; i < imageData.data.length; i += 4) {
    // Just take the red canal of the imageData array
    let binaryValue = imageData.data[i] === mapColor.r ? 0 : 1;

    if(isFirst) {
      colorData.push([binaryValue]);
    }
    else {
      colorData[rowIndex].push(binaryValue);
    }
    rowIndex++;

    if(rowIndex === canvas.height) {
      isFirst = false;
      rowIndex = 0;
    }
  }
  colorData = erode(colorData, defaults.width, defaults.height, 5);
  setColorData(colorData);
  return colorData;
};

/**
 * Returns a rectangular polygon feature that encompasses all vertices
 * @param route a Feature or FeatureCollection
 */
let calcBbox = function(route) {
  let feature = turf.envelope(route);
  return turf.bbox(feature);
};

let getCanvas = function() {
  return canvas;
};

let getFeatures = function() {
  return turf.featureCollection(features);
};

let setFeatures = function(val) {
  features = val;
};

function setColorData(data) {
  colorData = data;
};

let getColorData = function() {
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

module.exports.createPixelData = createPixelData;
module.exports.getMousePosition = getMousePosition;
module.exports.getCanvas = getCanvas;
module.exports.getColorData = getColorData;
module.exports.getFeatures = getFeatures;
module.exports.createCanvas = createCanvas;
module.exports.setScale = setScale;
module.exports.setFeatures = setFeatures;
module.exports.initMap = initMap;
module.exports.updateVal = updateVal;
module.exports.registerClick = registerClick;
module.exports.calcBbox = calcBbox;
