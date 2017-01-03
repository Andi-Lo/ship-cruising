'use strict';

// https://en.wikipedia.org/wiki/Erosion_(morphology)

let kernel = require('./kernel');

/**
 * Takes a two dimensional array (so to speak a binary image)
 * like this:
 * 0 0 0 0
 * 0 0 1 0
 * 0 0 0 0
 * and eliminates black pixels (represented as ones). The threshold defines how
 * strong the erosion should be.
 * @param {Array} binaryImage
 * @param {Number} width
 * @param {Number} height
 * @param {Number} threshold
 * @returns an eroded two dimensional array
 */
module.exports = function(binaryImage, w, h, threshold) {
  let result = binaryImage;

  for(let i = 1; i < w - 1; i++) {
    for(let j = 1; j < h - 1; j++) {
      if(binaryImage[i][j] == 1) {
        let neighbours = kernel(binaryImage, i, j);
        if(neighbours > threshold) {
          result[i][j] = 0;
        }
      }  // ends if binaryImage equals 0
    }
  }
  return result;
};
