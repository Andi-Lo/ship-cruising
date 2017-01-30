'use strict';

let geoViewport = require('geo-viewport');

/**
 * Takes a bbox, the viewports width and height and returns an object containing the
 * optiomal zoom level and the center point of the bbox.
 *
 * @name bbox
 * @typedef {[number, number, number, number]} Bbox
 * @param {Bbox} bbox
 * @param {number} width of the viewport
 * @param {number} height of the viewport
 * @returns {Object} bbox object with properties: minX, minY, maxX, maxY, center, zoom
 */
module.exports = function(bbox, width, height) {
  let coords = bbox;
  bbox = geoViewport.viewport(bbox, [width, height]);
  bbox.minX = coords[0];
  bbox.minY = coords[1];
  bbox.maxX = coords[2];
  bbox.maxY = coords[3];

  return bbox;
};
