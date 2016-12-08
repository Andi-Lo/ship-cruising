'use strict';

let mercator = require('../libs/mercator');
let turf = require('../libs/turf');
let d3 = require("d3");

let createNode = function(coords) {
  return {
    radius: 4,
    x: coords.x,
    y: coords.y,
  };
};

let getNodes = (route) => {
  let d = [];
  let i = 0;
  turf.meta.coordEach(route, function(coord) {
    let pixel = mercator.posToPixel(coord);
    if(i === 0 || i === route.geometry.coordinates.length-1) {
      d.push(createNode(i, pixel));
      d[i].fx = pixel.x;
      d[i].fy = pixel.y;
    }
    else {
      d.push(createNode(i, pixel));
    }
    ++i;
  });
  return d;
};

let getLinks = (nodes) => {
  let next = 1;
  let prev = 0;
  let obj = [];
  while(next < nodes.length) {
    obj.push({source: prev, target: next, value: 1});
    prev = next;
    ++next;
  }
  return obj;
};

let force = function(route) {
  let width = 960;
  let height = 500;
  let nodes = getNodes(route);
  let links = getLinks(nodes);

  d3.select("#strengthElem").on("input", function() {
    linkForce.strength(this.value);
    simulation.alpha(0.5).restart();  // Re-heat the simulation
  });

  d3.select("#distanceElem").on("input", function() {
    linkForce.distance(this.value);
    simulation.alpha(0.5).restart();  // Re-heat the simulation
  });

  d3.select("#mbSterngth").on("input", function() {
    manyBody.strength(this.value);
    simulation.alpha(0.5).restart();  // Re-heat the simulation
  });

  let linkForce = d3.forceLink()
    .id(function(d) { return d.index; })
    .strength(2)
    .distance(1);

  let manyBody = d3.forceManyBody()
    .strength(2);

  let simulation = d3.forceSimulation().nodes(nodes)
    .force("link", linkForce)
    .force("charge", manyBody);

  let svg = d3.select('force').append('svg')
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
};

module.exports.force = force;
