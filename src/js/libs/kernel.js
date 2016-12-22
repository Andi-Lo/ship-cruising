'use strict';

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
module.exports = function(pixels, w, h, x, y) {
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
