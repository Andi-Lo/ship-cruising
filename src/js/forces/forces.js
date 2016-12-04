'use strict';

let mercator = require('../libs/mercator');
let turf = require('../libs/turf');

let getNodes = (route) => {
  let d = [];
  let i = 0;
  turf.meta.coordEach(route, function(coord) {
    let pixel = mercator.posToPixel(coord);
    d.push({
      id: i,
      radius: 4,
      x: pixel.x,
      y: pixel.y
    });
    ++i;
  });
  return d;
};

let getLinks = (nodes) => {
  let next = 1;
  let prev = 0;
  let obj = [];
  while(next < nodes.length) {
    obj.push({source: prev, target: next});
    prev = next;
    ++next;
  }
  return obj;
};

let force = function(route) {
  let width = 960;
  let height = 500;
  let m = 10;

  let color = d3.scaleSequential(d3.interpolateRainbow)
      .domain(d3.range(m));

  let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().distanceMax(40));

  let nodes = getNodes(route);
  console.log('nodes', nodes);
  let links = getLinks(nodes);
  console.log('links', links);

  let svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

  let link = svg.append("g")
        .attr('class', 'link')
      .selectAll('.link')
      .data(links)
      .enter().append('line')
        .attr("stroke-width", 1);

  let node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .attr("fill", function(d) { return color(d.radius); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
    .text(function(d) { return d.id; });

  simulation.nodes(nodes).on("tick", ticked);

  simulation.force("link").links(links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
};

module.exports.force = force;
