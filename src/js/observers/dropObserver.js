'use strict';

let canvasMap = require('../modules/canvasMap');
let calcBbox = require('../libs/turf').calcBbox;
let setView = require('../modules/leafletMap').setView;

class DropObserver {
  constructor(selector, fcMap) {
    this.dndController(selector).then((files) => {
      let reader = new FileReader();
      reader.onloadend = function(e) {
        let fcRoute = JSON.parse(reader.result);
        setView(calcBbox(fcRoute));
        canvasMap.updateMap(fcRoute, fcMap);
      };
      reader.readAsText(files[0]);
    });
  }

  dndController(selector) {
    return new Promise(function(resolve, reject) {
      let el_ = window.document.getElementsByClassName(selector)[0];

      el_.dragenter = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.add('dropping');
      };

      el_.dragover = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.add('dropping');
      };

      el_.dragleave = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.remove('dropping');
      };

      el_.drop = function(e) {
        e.stopPropagation();
        e.preventDefault();
        el_.classList.remove('dropping');
        return resolve(e.dataTransfer.files);
      };

      el_.addEventListener('dragenter', el_.dragenter, false);
      el_.addEventListener('dragover', el_.dragover, false);
      el_.addEventListener('dragleave', el_.dragleave, false);
      el_.addEventListener('drop', el_.drop, false);
    });
  }
}

module.exports.DropObserver = DropObserver;
