'use strict';

// https://en.wikipedia.org/wiki/Dilation_(morphology)

let kernel = require('./kernel');

/**
 * Takes a binary image and dilates it with a kernel
 * @param {Array} 2d binary Array
 * @param {Number} w width
 * @param {Number} h height
 * @param {Number} threshold
 * @param {Number} value 0 or 1 depending on your binary image
 * @returns dilated image
 */
module.exports = function(binaryImage, w, h, threshold) {
  let result = binaryImage;
  let neighbours = 0;

  for(let i = 1; i < w - 1; i++) {
    for(let j = 1; j < h - 1; j++) {
      if(binaryImage[i][j] == 1) {
        neighbours = kernel(binaryImage, i, j);
        if(neighbours >= threshold) {
          // console.log(neighbours, threshold);
          result[i][j] = 0;
        }
      }  // ends if binaryImage equals 0
    }
  }
  return result;
};
