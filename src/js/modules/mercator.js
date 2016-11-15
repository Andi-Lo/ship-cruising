'use strict';

let turf = require('./turf');
let defaults = require('./options').defaults;
let SM = new (require('sphericalmercator'))();
let bbox = require('./bbox');
let bboxJamaika = [
  -91.14257812499999,
  7.493196470122287,
  -64.8193359375,
  25.839449402063185
];

// let bboxKaribik = [
//   -87.95654296875,
//   9.709057068618208,
//   -62.75390625,
//   29.19053283229458
// ];

/**
 * Takes a long, lat coordinate
 * @param {[any,any]} coord
 * @returns a pixel position in form [p.x, p.y]
 */
let positionToPixel = function(coord) {
  let origin = getOrigin();
  let px = SM.px(coord, origin.zoom);

  let pixel = [];
  pixel.x = px[0] - origin[0];
  pixel.y = px[1] - origin[1];

  return pixel;
};

/**
 * Takes a pixel position of [num, num] and calculating the longLat for it
 * @param {[any, any]} pixelPos
 * @returns {[any, any]} a longLat position
 */
let pixelToPosition = function(pixelPos) {
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
let calculateScale = function(units = 'kilometers', box = bboxJamaika) {
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
function getOrigin(box = bboxJamaika) {
  let bounds = bbox(box, defaults.width, defaults.height);
  let center = SM.px(bounds.center, bounds.zoom);

  let origin = [
    center[0] - defaults.width/2,
    center[1] - defaults.height/2,
  ];
  origin['zoom'] = bounds.zoom;

  return origin;
}

module.exports.calcScale = calculateScale;
module.exports.posToPixel = positionToPixel;
module.exports.pixelToPos = pixelToPosition;
