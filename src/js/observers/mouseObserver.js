'use strict';

let Loader = require('../libs/loader').Loader;
let canvasMap = require('../modules/canvasMap');
let calcBbox = require('../libs/turf').calcBbox;
let setView = require('../modules/leafletMap').setView;

class MouseObserver {
  constructor(fcMap) {
    let calc = window.document.getElementById('calc');

    calc.addEventListener('click', function(evt) {
      let select = window.document.getElementsByClassName('dropdown')[0];
      let spinner = window.document.getElementById('spinner');
      let cover = window.document.getElementById('cover');
      spinner.className = 'cssload-whirlpool';
      cover.className = 'cover';
      select.option = select.options[select.selectedIndex].value;
      let path = `./harbours/${select.option}.geojson`;
      let loadRoute = new Loader(path);

      loadRoute.then((fcRoute) => {
        setView(calcBbox(fcRoute));
        let status = canvasMap.initMap(fcRoute, fcMap);
        if(status === "Done!") {
          spinner.className = '';
          cover.className = '';
        }
      });
    });
  }
}

module.exports.MouseObserver = MouseObserver;
