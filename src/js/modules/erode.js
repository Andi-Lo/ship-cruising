'use strict';

// https://en.wikipedia.org/wiki/Erosion_(morphology)
// https://en.wikipedia.org/wiki/Dilation_(morphology)

(function(){Math.clamp=function(a,b = 0,c = 99999999){return Math.max(b,Math.min(c,a));}})(); // eslint-disable-line

module.exports = function(colorData, w, h) {
  let result = colorData;
  let neighbours = [];

  for(let x = 0; x < w; x++) {
    for(let y = 0; y < h; y++) {
      let pix = colorData[x][y];
      if(pix === 1) {
        neighbours = kernel(colorData, w, h, x, y);
        let threshold = neighbours.reduce((a, b) => {
          return a + b;
        }, 0);
        if(threshold < 5)
          result[x][y] = 0;
      }
      else {
        result[x][y] = pix;
      }
    }
  }
  return result;
};

/**
 * Searches the neighbours of a given binary image by search patern
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
  let pixs = [];

  pixs.push(pixels[Math.clamp(((x-1) % w))][Math.clamp(((y-1) % h))]);
  pixs.push(pixels[x][Math.clamp((y-1) % h)]);
  pixs.push(pixels[(x+1) % w][Math.clamp((y-1) % h)]);

  pixs.push(pixels[Math.clamp((x-1) % w)][y]);
  pixs.push(pixels[(x+1) % w][y]);

  pixs.push(pixels[Math.clamp((x-1) % w)][(y+1) % h]);
  pixs.push(pixels[x][(y+1) % h]);
  pixs.push(pixels[(x+1) % w][(y+1) % h]);

  pixs = pixs.filter(isNull);

  pixs.push(pixels[x][y]);
  return pixs;
};

function isNull(value) {
  return value != 0;
}
