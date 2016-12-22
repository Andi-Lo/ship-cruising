'use strict';

// https://en.wikipedia.org/wiki/Erosion_(morphology)

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
  console.log('binaryImage', binaryImage);

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

/**
 * Searches the neighbours of a given binary image by search pattern
 * 0 0 0
 * 0 1 0
 * 0 0 0
 * @param {any} pixels
 * @param {any} w
 * @param {any} h
 * @param {any} x
 * @param {any} y
 * @returns an array containing the neighbours values
 */
function kernel(pixels, w, h, x, y) {
  w = w - 1;
  h = h - 1;
  let pixs = [];

  pixs.push(pixels[((y-1) % h) < 0 ? h : x % h][((x-1) % w) < 0 ? w : x % w]);
  pixs.push(pixels[((y-1) % h) < 0 ? h : x % h][x]);
  pixs.push(pixels[((y-1) % h) < 0 ? h : x % h][(x+1) % w]);

  pixs.push(pixels[y][((x-1) % w) < 0 ? w : x % w]);
  pixs.push(pixels[y][(x+1) % w]);

  pixs.push(pixels[(y+1) % h][((x-1) % w) < 0 ? w : x % w]);
  pixs.push(pixels[(y+1) % h][x]);
  pixs.push(pixels[(y+1) % h][(x+1) % w]);

  pixs = pixs.filter(isNull);

  pixs.push(pixels[y][x]);
  return pixs;
};

function isNull(value) {
  return value != 0;
}
