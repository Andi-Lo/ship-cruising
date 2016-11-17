'use strict';

let Observer = require('./observer').Observer;
let canvasMap = require('../modules/canvasMap');

class CanvasObserver extends Observer {
  constructor(canvas) {
    super();

    canvas.addEventListener('click', function(evt) {
      canvasMap.registerClick(evt);
    }, false);

    canvas.addEventListener('mousemove', function(evt) {
      canvasMap.updateVal(evt);
    }, false);
  }
}

module.exports.CanvasObserver = CanvasObserver;
