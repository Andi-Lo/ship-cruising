'use strict';

let turf = require('./turf');
let defaults = require('../modules/options').defaults;
let SM = new (require('@mapbox/sphericalmercator'))();
let bbox = require('./bbox');

/**
 * @typedef {[number, number, number, number]} Bbox
*/

/**
 * Takes a long, lat coordinate and returns an object with the corresponding
 * pixel coordinates for the canvas using sphericalmercator projection.
 *
 * @name positionToPixel
 * @param {Array<number>} coord 2‑tuple [number, number] where numbers must be long, lat
 * @returns {Object} a pixel position object with properties {p.x, p.y}
 */
let positionToPixel = function(coord) {
  if (typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
    throw new Error('Argument should be an array [number, number] '
     + typeof(coord[0]) + ' given');
  }
  let origin = getOrigin();
  let px = SM.px(coord, origin.zoom);

  let pixel = [];
  pixel.x = px[0] - origin[0];
  pixel.y = px[1] - origin[1];

  return pixel;
};

/**
* Takes a pixel coordinate and returns an object with the corresponding
* long,lat coordinates using sphericalmercator projection. This is the reverse of {@link positionToPixel}
 *
 * @name pixelToPosition
 * @param {Array<number>} pixelPos 2‑tuple [number, number] where number must be a int value
 * @returns {Object} a longLat position object in form {p.x, p.y}
 */
let pixelToPosition = function(pixelPos) {
  if (typeof pixelPos[0] !== 'number' || typeof pixelPos[1] !== 'number') {
    throw new Error('Argument should be an array [number, number] '
      + typeof(pixelPos[0]) + ' given');
  }
  let origin = getOrigin();

  let pixel = [];
  pixel.x = pixelPos[0] + origin[0];
  pixel.y = pixelPos[1] + origin[1];

  let longLat = SM.ll([pixel.x, pixel.y], origin.zoom);
  longLat.x = longLat[0];
  longLat.y = longLat[1];

  return longLat;
};

/**
 * Takes a bbox and calculates the scale of the map taking the distance from the
 * lower left corner to the lower right corner of the rectangle.
 *
 * @param {string} units (default kilometers) can be miles, or kilometers
 * @param {Bbox} box
 * @returns the scale of 1px in units
 */
let calculateScale = function(units = 'kilometers', box = defaults.bbox) {
  let bounds = bbox(box, defaults.width, defaults.height);
  let start = turf.point([bounds.minX, bounds.minY]);
  let end = turf.point([bounds.maxX, bounds.minY]);
  let dist = Math.floor(turf.distance(start, end, units));
  let scale = Math.ceil(dist / defaults.width);

  return scale;
};

/**
 * get the origin which is the very top left corner of the canvas
 * plus the actual zoom level of the bbox
 *
 * @param {Bbox} box
 * @returns {Object} containing [origin, zoom, stepSize]
 */
let getOrigin = function(box = defaults.bbox) {
  let bounds = bbox(box, defaults.width, defaults.height);
  let center = SM.px(bounds.center, bounds.zoom);

  let origin = [
    center[0] - defaults.width/2,
    center[1] - defaults.height/2,
  ];
  origin['zoom'] = bounds.zoom;
  origin['stepSize'] = getStepSize(origin.zoom);
  return origin;
};

function getStepSize(zoomLevel) {
  return 0.458333 * Math.pow(zoomLevel, 2) - 7.62348 * zoomLevel + 33.8833;
}

module.exports.calcScale = calculateScale;
module.exports.posToPixel = positionToPixel;
module.exports.pixelToPos = pixelToPosition;
module.exports.getOrigin = getOrigin;
