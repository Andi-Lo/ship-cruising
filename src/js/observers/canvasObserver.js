'use strict';

let canvasMap = require('../modules/canvasMap');

class CanvasObserver {
  constructor(canvas) {
    canvas.addEventListener('mousemove', function(evt) {
      canvasMap.updateVal(evt);
    }, false);
  }
}

module.exports.CanvasObserver = CanvasObserver;
