'use strict';

let turf = require('./turf');
let defaults = require('../modules/options').defaults;
let SM = new (require('sphericalmercator'))();
let bbox = require('./bbox');

/**
 * Takes a long, lat coordinate
 * @param [any,any] coord
 * @returns {any, any} a pixel position object in form {p.x, p.y}
 */
let positionToPixel = function(coord) {
  if (typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
    throw new Error('Argument should be an array [number, number]');
  }
  let origin = getOrigin();
  let px = SM.px(coord, origin.zoom);

  let pixel = [];
  pixel.x = px[0] - origin[0];
  pixel.y = px[1] - origin[1];

  return pixel;
};

/**
 * Takes a pixel position of [num, num] and calculating the longLat for it
 * @param [any, any] pixelPos
 * @returns {any, any} a longLat position object in form {p.x, p.y}
 */
let pixelToPosition = function(pixelPos) {
  if (typeof pixelPos[0] !== 'number' || typeof pixelPos[1] !== 'number') {
    throw new Error('Argument should be an array [number, number]');
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
 * @param {string} units (default kilometers) can be miles, or kilometers
 * @param {[any,any,any,any]} box
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
 * @param {bbox} [box=bboxJamaika]
 * @returns {[num, num, zoom]}
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
  switch (zoomLevel) {
    case 1:
      return 250;
    case 2:
      return 200;
    case 3:
      return 150;
    case 4:
      return 100;
    case 5:
      return 30;
    case 6:
      return 10;
    case 7:
      return 5;
    case 8:
      return 3;
    case 9:
      return 2;
    default:
      return 75;
  }
}

module.exports.calcScale = calculateScale;
module.exports.posToPixel = positionToPixel;
module.exports.pixelToPos = pixelToPosition;
module.exports.getOrigin = getOrigin;
