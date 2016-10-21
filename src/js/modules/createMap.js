'use strict';

module.exports = function(width, height) {
  var map = document.createElement('canvas');
  map.width = width;
  map.height = height;
  return map;
};
