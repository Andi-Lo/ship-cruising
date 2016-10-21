'use strict';

var mercator = new (require('sphericalmercator'))();
var bbox = require('./bbox');
// var count = 0;

  /**
   * Takes a long, lat coordinate, the origin of your viewport plus a zoom level
   * @param {any} coord
   * @param {any} zoom
   * @returns a pixel position
   */
module.exports = function(coord) {
  var bounds = bbox([-87.95654296875, 9.709057068618208, -62.75390625, 29.19053283229458], 640, 640);
  var center = mercator.px(bounds.center, bounds.zoom);

  // if (count === 0) {
  //   console.log('bounds', bounds);
  //   count++;
  // }
  var pixel = [];
  var origin = [
    center[0] - 320,
    center[1] - 320
  ];

  var px = mercator.px(coord, bounds.zoom);

  pixel.x = px[0] - origin[0];
  pixel.y = px[1] - origin[1];

  return pixel;
};
