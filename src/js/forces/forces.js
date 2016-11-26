'use strict';

let mercator = require('../libs/mercator');
let turf = require('../libs/turf');

let force = function(route) {
  // console.log('route', route);

  let width = 960;
  let height = 500;
  let radius = 3;

  let m = 10;

  let color = d3.scaleSequential(d3.interpolateRainbow)
      .domain(d3.range(m));

  let getNodes = (route) => {
    let d = [];
    turf.meta.coordEach(route, function(coord) {
      let i = Math.floor(Math.random() * m);
      let pixel = mercator.posToPixel(coord);
      d.push({
        radius: radius,
        cluster: i,
        x: pixel.x,
        y: pixel.y
      });
    });
    return d;
  };

  let nodes = getNodes(route);

  // console.log('nodes', nodes);

  let simulation = d3.forceSimulation()
    // keep entire simulation balanced around screen center
    .force('many', d3.forceManyBody().strength(-1).distanceMax(6))

    .force('collide', d3.forceCollide(function(d) { return d.radius; }))

    .on('tick', layoutTick)
    .nodes(nodes);

  let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);

  let node = svg.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .style('fill', function(d) { return color(d.radius/10); });

  function layoutTick(e) {
    node
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; })
      .attr('r', function(d) { return d.radius; });
  }
};

module.exports.force = force;
