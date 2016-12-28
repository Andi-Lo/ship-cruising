'use strict';

let calcClientRect = function() {
  let h = window.document.getElementsByClassName('tool-wrapper')[0];
  let height = window.innerHeight - h.offsetHeight;
  let width = window.innerWidth;
  return {height, width};
};

let flatten = function(array) {
  if(array.length > 0) {
    return array.reduce(function(a, b) {
      return a.concat(b);
    });
  }
};

module.exports.calcClientRect = calcClientRect;
module.exports.flatten = flatten;
