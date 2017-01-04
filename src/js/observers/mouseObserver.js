'use strict';

let Observer = require('./observer').Observer;
let Loader = require('../libs/loader').Loader;

class MouseObserver {
  constructor(fc) {
    let calc = window.document.getElementById('calc');

    calc.addEventListener('click', function(evt) {
      let select = window.document.getElementsByClassName('dropdown')[0];
      select.option = select.options[select.selectedIndex].value;
      let path = `./map/${select.option}.geojson`;
      let features = new Loader(path);

      features.then((fcRoute) => {
        Observer.addRouteToPixelMap(fcRoute, fc);
      });
    });
  }
}

module.exports.MouseObserver = MouseObserver;
