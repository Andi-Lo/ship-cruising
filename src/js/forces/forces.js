'use strict';

let mercator = require('../libs/mercator');
let turf = require('../libs/turf');
let leafletMap = require('../modules/leafletMap');
let leaflet = require('leaflet');

let createNode = function(id, coords) {
  return {
    radius: 4,
    x: coords.x,
    y: coords.y,
  };
};

let getNodes = (route, map) => {
  let d = [];
  let i = 0;
  turf.meta.coordEach(route, function(coord) {
    // let pixel = mercator.posToPixel(coord);
    let pixel = projectPoint(coord[0], coord[1], map);
    console.log(coord);
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

// Use Leaflet to implement a D3 geometric transformation.
let projectPoint = function(x, y, map) {
  return map.latLngToLayerPoint(new L.LatLng(y, x));
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
  console.log('route', route);
  let width = 640;
  let height = 640;
  let maps = leafletMap.getMaps();
  let nodes = getNodes(route, maps[0]);
  let links = getLinks(nodes);

  let simulation = d3.forceSimulation().nodes(nodes)
    .force("link", d3.forceLink().id(function(d) { return d.index; }))
    .force("charge", d3.forceManyBody());

  let svg = d3.select(maps[0].getPanes().overlayPane).append('svg')
    .attr('width', width)
    .attr('height', height);
  let g = svg.append("g").attr("class", "leaflet-zoom-hide");

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
      .attr("fill", function(d) { return '#fabfab'; });

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
};

module.exports.force = force;
