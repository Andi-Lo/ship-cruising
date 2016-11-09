'use strict';

var mercator = new (require('sphericalmercator'))();
var bbox = require('./bbox');
var options = require('./options');
var defaults = options.defaults;
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
   * Takes a long, lat coordinate, the origin of your viewport plus a zoom level
   * @param {any} coord
   * @param {any} zoom
   * @returns a pixel position
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

var calculateScale = function(start, end, units) {
  let from = turf.point(start.x, start.y);
};

module.exports.calcScale = calculateScale;

module.exports.posToPixel = positionToPixel;
