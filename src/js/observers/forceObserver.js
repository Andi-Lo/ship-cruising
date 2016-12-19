'use strict';

let Observer = require('./observer').Observer;
let force = require('../forces/forces');
let select = require('d3-selection').select;

class ForceObserver extends Observer {
  constructor(simulation) {
    super();

    select("#strengthElem").on("input", function() {
      force.linkForce.strength(this.value);
      simulation.alpha(0.5).restart();  // Re-heat the simulation
    });

    select("#distanceElem").on("input", function() {
      force.linkForce.distance(this.value);
      simulation.alpha(0.5).restart();
    });

    select("#mbSterngth").on("input", function() {
      force.manyBody.strength(this.value);
      simulation.alpha(0.5).restart();
    });

    select("#mbMinDist").on("input", function() {
      force.manyBody.distanceMin(this.value);
      simulation.alpha(0.5).restart();
    });

    select("#mbMaxDist").on("input", function() {
      force.manyBody.distanceMax(this.value);
      simulation.alpha(0.5).restart();
    });

    select("#colStrength").on("input", function() {
      force.collide.strength(this.value);
      simulation.alpha(0.5).restart();
    });

    select("#colRadius").on("input", function() {
      force.collide.radius(this.value);
      simulation.alpha(0.5).restart();
    });

    select("#colIterations").on("input", function() {
      force.collide.iterations(this.value);
      simulation.alpha(0.5).restart();
    });
  }
}

module.exports.ForceObserver = ForceObserver;
