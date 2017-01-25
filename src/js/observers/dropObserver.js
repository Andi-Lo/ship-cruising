'use strict';

let canvasMap = require('../modules/canvasMap');
let calcBbox = require('../libs/turf').calcBbox;
let setView = require('../modules/leafletMap').setView;

class DropObserver {
  constructor(selector, fcMap) {
    this.dndController(selector, fcMap);
  }

  static addSpinner() {
    return new Promise((resolve, reject) => {
      let spinner = window.document.getElementById('spinner');
      let cover = window.document.getElementById('cover');
      spinner.className = 'cssload-whirlpool';
      cover.className = 'cover';

      let sleep = ((sleepyTime) => {
        let start = +new Date;
        while (+new Date - start < sleepyTime);
      });
      sleep(50);

      return resolve();
    });
  }

  static handleDrop(e, fcMap) {
    let reader = new FileReader();
    let spinner = window.document.getElementById('spinner');
    let cover = window.document.getElementById('cover');
    spinner.className = 'cssload-whirlpool';
    cover.className = 'cover';
    reader.onloadend = function(e) {
      let fcRoute = JSON.parse(reader.result);
      setView(calcBbox(fcRoute));
      let status = canvasMap.initMap(fcRoute, fcMap);
      if(status === "Done!") {
        spinner.className = '';
        cover.className = '';
      }
    };
    reader.readAsText(e.dataTransfer.files[0]);
  }

  dndController(selector, fcMap) {
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
      let spinner = window.document.getElementById('spinner');
      let cover = window.document.getElementById('cover');
      DropObserver.addSpinner().then(() => {
        let reader = new FileReader();
        reader.onloadend = function(e) {
          let fcRoute = JSON.parse(reader.result);
          setView(calcBbox(fcRoute));
          let status = canvasMap.initMap(fcRoute, fcMap);
          if(status === "Done!") {
            spinner.className = '';
            cover.className = '';
          }
        };
        reader.readAsText(e.dataTransfer.files[0]);
      });
    };

    el_.addEventListener('dragenter', el_.dragenter, false);
    el_.addEventListener('dragover', el_.dragover, false);
    el_.addEventListener('dragleave', el_.dragleave, false);
    el_.addEventListener('drop', el_.drop, false);
  }
}

module.exports.DropObserver = DropObserver;
