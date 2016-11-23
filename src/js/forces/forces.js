'use strict';

let mercator = require('../libs/mercator');
let turf = require('../libs/turf');

let force = function(route) {
  console.log('route', route);

  let width = 960;
  let height = 500;
  let padding = 1.5; // separation between same-color nodes
  let clusterPadding = 6; // separation between different-color nodes
  let maxRadius = 8;

  let n = 200; // total number of nodes
  let m = 10; // number of distinct clustersk

  let color = d3.scaleSequential(d3.interpolateRainbow)
      .domain(d3.range(m));

  // The largest node for each cluster.
  let clusters = new Array(m);

  let getNodes = (route) => {
    let d = [];
    turf.meta.coordEach(route, function(coord) {
        let i = Math.floor(Math.random() * m);
        let r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius;
      let pixel = mercator.posToPixel(coord);
      d.push({
        radius: r,
        cluster: i,
        x: pixel.x,
        y: pixel.y
      });
    });
    return d;
  }

  let nodes = getNodes(route);

  console.log('nodes', nodes);

  let simulation = d3.forceSimulation()
    // keep entire simulation balanced around screen center
    .force('center', d3.forceCenter(width/2, height/2))

    // cluster by section
    .force('cluster', d3.forceCluster()
      .centers(function (d) { return clusters[d.cluster]; })
      .strength(0.5))

    // apply collision with padding
    .force('collide', d3.forceCollide(function (d) { return d.radius + padding; }))

    .on('tick', layoutTick)
    .nodes(nodes);

  let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);

  let node = svg.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .style('fill', function (d) { return color(d.cluster/10); });

  function layoutTick (e) {
    node
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', function (d) { return d.radius; });
  }
}

module.exports.force = force;
