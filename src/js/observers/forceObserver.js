'use strict';

let Observer = require('./observer').Observer;
let force = require('../forces/forces');
let d3 = require('d3');

class ForceObserver extends Observer {
  constructor(simulation) {
    super();

    d3.select("#strengthElem").on("input", function() {
      force.linkForce.strength(this.value);
      simulation.alpha(0.5).restart();  // Re-heat the simulation
    });

    d3.select("#distanceElem").on("input", function() {
      force.linkForce.distance(this.value);
      simulation.alpha(0.5).restart();
    });

    d3.select("#mbSterngth").on("input", function() {
      force.manyBody.strength(this.value);
      simulation.alpha(0.5).restart();
    });

    d3.select("#mbMinDist").on("input", function() {
      force.manyBody.distanceMin(this.value);
      simulation.alpha(0.5).restart();
    });

    d3.select("#mbMaxDist").on("input", function() {
      force.manyBody.distanceMax(this.value);
      simulation.alpha(0.5).restart();
    });
  }
}

module.exports.ForceObserver = ForceObserver;
