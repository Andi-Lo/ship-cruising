'use strict';

let mercator = require('../libs/mercator');
let turf = require('../libs/turf');
let d3 = require("d3");

let simulation;
let mbStrength = 1;
let _route = [];
let distElem = window.document.getElementById('distanceElem');
let strengthElem = window.document.getElementById('strengthElem');
let mbStrengthElem = window.document.getElementById('mbStrengthElem');
let distance;
let strength = strengthElem.value;
distance = distElem.value;

// strengthElem.addEventListener('click', function(evt) {
//   strength = strengthElem.value;
//   distance = distElem.value;
//   console.log('strength', strength);
//   // d3.select('force').selectAll("*").remove();
//   // simulation.alphaTarget(0);
//   simulation.alphaTarget(0.3).restart();
//   // force(_route, distance, strength);
// }, false);

mbStrengthElem.addEventListener('click', function(evt) {
  mbStrength = mbStrengthElem.value;
  // d3.select('force').selectAll("*").remove();
  console.log('strength', mbStrength);
  // simulation.alphaTarget(0);
  simulation.alphaTarget(0.3).restart();
  // force(_route, distance, strength);
}, false);

distElem.addEventListener('click', function(evt) {
  strength = strengthElem.value;
  distance = distElem.value;
  console.log('dist', distance);
  // d3.select('force').selectAll("*").remove();
  // simulation.alphaTarget(0);
  simulation.alphaTarget(0.3).restart();
  // force(_route, distance, strength);
}, false);

let clearForces = function() {
  d3.select('force').selectAll("*").remove();
};

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

let force = function(route, distance = 1, strength = 2) {
  _route = route;
  let width = 960;
  let height = 500;
  let nodes = getNodes(route);
  let links = getLinks(nodes);

  simulation = d3.forceSimulation().nodes(nodes)
    .force("link", d3.forceLink()
      .id(function(d) { return d.index; })
      .strength(function(d) { return strength; })
      .distance(function(d) { return distance; }))
    .force("charge", d3.forceManyBody()
      .strength(function(d) { return mbStrength; })
      .distanceMax(function(d) { return 10; })
      .distanceMin(function(d) { return 1; }));

  let svg = d3.select('force').append('svg')
    .attr('width', width)
    .attr('height', height);

  let link = svg.append("g")
      .attr('class', 'link')
    .selectAll('.link')
    .data(links)
    .enter().append('line')
      .attr("stroke-width", 1);

  d3.select("#strengthElem").on("input", function() {
    strength = this.value;
    simulation.alphaTarget(0.3).restart();
  });

  console.log('force', force.strength);

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
module.exports.clearForces = clearForces;

