'use strict';

var options = require('./options');
var turf = require('./turf');
var defaults = options.defaults;
var mercator = new (require('sphericalmercator'))();
var bbox = require('./bbox');
var bboxJamaika = [
  -91.14257812499999,
  7.493196470122287,
  -64.8193359375,
  25.839449402063185
];

var bboxKaribik = [
  -87.95654296875,
  9.709057068618208,
  -62.75390625,
  29.19053283229458
];

/**
 * Takes a long, lat coordinate
 * @param {[any,any]} coord
 * @returns a pixel position in form [p.x, p.y]
 */
var positionToPixel = function(coord) {
  var bounds = bbox(bboxJamaika, defaults.width, defaults.height);
  var center = mercator.px(bounds.center, bounds.zoom);

  var origin = [
    center[0] - defaults.width/2,
    center[1] - defaults.height/2
  ];

  var px = mercator.px(coord, bounds.zoom);

  var pixel = [];
  pixel.x = px[0] - origin[0];
  pixel.y = px[1] - origin[1];

  return pixel;
};

/**
 * Takes a bbox and calculates the scale of the map taking the distance from the
 * lower left corner to the lower right corner of the rectangle.
 * @param {string} units (default kilometers) can be miles, or kilometers
 * @param {[any,any,any,any]} box
 * @returns the scale of 1px in units
 */
var calculateScale = function(units = 'kilometers', box = bboxJamaika) {
  var bounds = bbox(box, defaults.width, defaults.height);
  var start = turf.point([bounds.minX, bounds.minY]);
  var end = turf.point([bounds.maxX, bounds.minY]);
  var dist = Math.floor(turf.distance(start, end, units));
  var scale = Math.ceil(dist / defaults.width);

  return scale;
};

module.exports.calcScale = calculateScale;
module.exports.posToPixel = positionToPixel;
