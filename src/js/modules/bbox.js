'use strict';

var geoViewport = require('geo-viewport');

module.exports = function(bbox, width, height) {
  var coords = bbox;
  bbox = geoViewport.viewport(bbox, [width, height]);
  bbox.minX = coords[0];
  bbox.minY = coords[1];
  bbox.maxX = coords[2];
  bbox.maxY = coords[3];

  return bbox;
};
