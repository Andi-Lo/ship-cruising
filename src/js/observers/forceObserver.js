'use strict';

let Observer = require('./observer').Observer;
let F = require('../forces/forces');

class ForceObserver extends Observer {
  constructor(route) {
    super();
    this._route = route;

    // let distElem = window.document.getElementById('distanceElem');
    // let strengthElem = window.document.getElementById('strengthElem');

    // strengthElem.addEventListener('click', function(evt) {
    //   let strength = strengthElem.value;
    //   let distance = distElem.value;
    //   console.log('strength', strength);
    //   // d3.select('force').selectAll("*").remove();
    //   F.clearForces();
    //   F.force(route, distance, strength);
    // }, false);

    // distElem.addEventListener('click', function(evt) {
    //   let strength = strengthElem.value;
    //   let distance = distElem.value;
    //   console.log('dist', distance);
    //   // d3.select('force').selectAll("*").remove();
    //   F.clearForces();
    //   F.force(route, distance, strength);
    // }, false);
  }
}

module.exports.ForceObserver = ForceObserver;
