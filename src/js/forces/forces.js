'use strict';

let d3 = require('d3');
let Link = require('./link').Link;
let Node = require('./node').Node;

const LINK_STR = 2;
const LINK_DIST = 1;
const MB_STR = 2;
const MB_DIST_MIN = 1;
const MB_DIST_MAX = 10;

let svg = d3.select('force').append('svg')
  .attr('width', 960)
  .attr('height', 500);

let linkForce = d3.forceLink()
  .id(function(d) { return d.index; })
  .strength(LINK_STR)
  .distance(LINK_DIST);

let manyBody = d3.forceManyBody()
  .strength(MB_STR)
  .distanceMin(MB_DIST_MIN)
  .distanceMax(MB_DIST_MAX);

let force = function(route) {
  let nodes = Node.getNodes(route);
  let links = Link.getLinks(nodes);

  let simulation = d3.forceSimulation().nodes(nodes)
    .force("link", linkForce)
    .force("charge", manyBody);

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
      .attr("fill", function(d) { return '#fabfab'; })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

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

  return simulation;
};

module.exports.force = force;
module.exports.linkForce = linkForce;
module.exports.manyBody = manyBody;
