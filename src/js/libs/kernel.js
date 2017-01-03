'use strict';

/**
 * Searches the neighbours of a given binary image by search pattern
 * 0 0 0
 * 0 1 0
 * 0 0 0
 * @param {Array} 2d binary Array
 * @param {Number} w
 * @param {Number} h
 * @param {Number} x
 * @param {Number} y
 * @param {Number} value 0 or 1 depending on your binary image
 * @returns an array containing the neighbours values
 */
module.exports = function(binaryImage, i, j) {
  let neighbours = 0;
  for(let a = -1; a <= 1; a++) {
    for(let b = -1; b <= 1; b++) {
      // avoid the center pixel
      if((a != 0 || b != 0) && (i + a > 0 && j + b > 0)) {
        if(binaryImage[i + a][j + b] == 0) {
          neighbours++;
        }
      }
    }
  }
  return neighbours;
};
