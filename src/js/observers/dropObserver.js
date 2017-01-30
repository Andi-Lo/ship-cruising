'use strict';

let canvasMap = require('../modules/canvasMap').canvasMap;
let calcBbox = require('../libs/turf').calcBbox;
let setView = require('../modules/leafletMap').setView;

/**
 * Class DropObserver handles the drag and drop event
 * @public
 * @class DropObserver
 */
class DropObserver {
  constructor(fcMap) {
    this.dndController('drop-zone', fcMap);
  }

  static addSpinner() {
    return new Promise((resolve, reject) => {
      let spinner = window.document.getElementById('spinner');
      let cover = window.document.getElementById('cover');
      spinner.className = 'cssload-whirlpool';
      cover.className = 'cover';

      // browser hack to try to force a redraw of the UI while executing javascript to display the loading spinner
      // see http://stackoverflow.com/a/30417587/2483301
      let sleep = ((sleepyTime) => {
        let start = +new Date;
        while (+new Date - start < sleepyTime);
      });
      sleep(50);

      return resolve();
    });
  }

  /**
   * handle the onDrop event and load the from user provided route
   *
   * @static
   * @param {Event} e
   * @param {FeatureCollection<Polygon>} fcMap
   *
   * @memberOf DropObserver
   */
  static handleDrop(e, fcMap) {
    let reader = new FileReader();
    let spinner = window.document.getElementById('spinner');
    let cover = window.document.getElementById('cover');
    spinner.className = 'cssload-whirlpool';
    cover.className = 'cover';
    reader.onloadend = function(e) {
      let fcRoute = JSON.parse(reader.result);
      setView(calcBbox(fcRoute));
      let status = canvasMap(fcRoute, fcMap);
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
          let status = canvasMap(fcRoute, fcMap);
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
