'use strict';

let Observer = require('./observer').Observer;
let canvasMap = require('../modules/canvasMap');

class CanvasObserver {
  constructor(canvas) {
    canvas.addEventListener('click', function(evt) {
      let pixelPos = canvasMap.getMousePosition(evt);
      canvasMap.registerClick(pixelPos);
    }, false);

    canvas.addEventListener('mousemove', function(evt) {
      canvasMap.updateVal(evt);
    }, false);
  }
}

module.exports.CanvasObserver = CanvasObserver;
