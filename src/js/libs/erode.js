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
 * @param {any} binaryImage
 * @param {any} w width
 * @param {any} h height
 * @param {any} threshold
 * @returns an eroded two dimensional array
 */
module.exports = function(binaryImage, w, h, threshold = 5) {
  let result = binaryImage;
  let neighbours = [];

  for(let x = 0; x < w; x++) {
    for(let y = 0; y < h; y++) {
      let pix = binaryImage[y][x];
      if(pix === 1) {
        neighbours = kernel(binaryImage, w, h, x, y);
        let sum = neighbours.reduce((a, b) => {
          return a + b;
        }, 0);
        if(sum < threshold)
          result[y][x] = 0;
      }
      else {
        result[y][x] = pix;
      }
    }
  }
  return result;
};

