'use strict';

/**
 * Calculates the clients screen dimensions minus the height of the tool.
 * This gives us the height of the interactive map.
 *
 * @returns {Object} with height and width
 */
let calcClientRect = function() {
  let h = window.document.getElementsByClassName('tool-wrapper')[0];
  let height = window.innerHeight - h.offsetHeight;
  let width = window.innerWidth;
  return {height, width};
};

/**
 * Flattens an array, thus reducing its nesting depth by 1.
 *
 * @example flatten([[a, b], c]) => returns [a, b, c];
 * @param {Array<Any>} array to be flattend
 * @returns {Array<Any>} the flattend array
 */
let flatten = function(array) {
  if(array.length > 0) {
    return array.reduce(function(a, b) {
      return a.concat(b);
    });
  }
};

module.exports.calcClientRect = calcClientRect;
module.exports.flatten = flatten;
