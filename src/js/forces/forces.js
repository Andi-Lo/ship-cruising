'use strict';

let d3 = require('d3-force');
d3.select = require('d3-selection').select;
let Link = require('./link').Link;
let Node = require('./node').Node;
let Landnode = require('./Landnode').Landnode;
let leafletMap = require('../modules/leafletMap');
let turf = require('../libs/turf');
let drawLeaflet = require('../modules/drawLeaflet');
let options = require('../modules/options');
let calcClientRect = require('../libs/helpers').calcClientRect;

const LINK_STR = 0.02;
const LINK_DIST = 1;
const MB_STR = -5;
const MB_DIST_MIN = 1;
const MB_DIST_MAX = 10;
const COLLIDE_RADIUS = 5;
const COLLIDE_STRENGTH = 0.2;
const COLLIDE_ITERATIONS = 1;

let linkForce = d3.forceLink()
  .id(function(d) { return d.index; })
  .strength(LINK_STR)
  .distance(LINK_DIST);

let manyBody = d3.forceManyBody()
  .strength(MB_STR)
  .distanceMin(MB_DIST_MIN)
  .distanceMax(MB_DIST_MAX);

let collide = d3.forceCollide()
  .radius(COLLIDE_RADIUS)
  .strength(COLLIDE_STRENGTH)
  .iterations(COLLIDE_ITERATIONS);

let force = function(route, land) {
  let globalFeatureCollection;
  let maps = leafletMap.getMap();
  let nodes = Node.getNodes(route, maps);
  let nodesLand = Landnode.getNodes(land, maps);
  let links = Link.getLinks(nodes);
  let clientRect = calcClientRect();

  // Add nodesLand after the route got linked
  nodes = nodes.concat(nodesLand);
  let svg = d3.select(maps.getPanes().overlayPane).append('svg')
    .attr('width', clientRect.width)
    .attr('height', clientRect.height);
  // let g = svg.append("g").attr("class", "leaflet-zoom-hide");
  let g = svg.append("g");

  linkForce.initialize(nodes);
  manyBody.initialize(nodes);
  collide.initialize(nodes);

  let simulation = d3.forceSimulation().nodes(nodes)
    .force("link", linkForce)
    .force("charge", manyBody)
    .force("collision", collide);

  simulation.alphaDecay(0.1);

  let link = g.attr('class', 'link')
    .selectAll('.link')
    .data(links)
    .enter().append('line')
      .attr("stroke-width", 1);

  let node = g.attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .attr("fill", function(d) { return d.color; });

  simulation.nodes(nodes).on("tick", ticked).on("end", end);
  simulation.force("link").links(links);
  maps.on("zoomend", update);
  leafletMap.disableZoom(maps);

  function update() {
    // Remove force points and just draw points in leaflet
    svg.selectAll("*").remove();
    // globalFeatureCollection will be initialized when simulation ended
    drawLeaflet.drawPoints(globalFeatureCollection,
        options.force.zoomPointRouteSize,
        options.force.zoomPointRouteColor);
    drawLeaflet.drawPointsCoastForces(land,
        options.force.zoomPointLandSize,
        options.force.zoomPointLandColor);
    drawLeaflet.drawPolyline(
        turf.fcToLineString(globalFeatureCollection),
        options.force.zoomLineColor,
        3
    );
  }

  function end() {
    // Get the x and y coordinates of the circles of the finished simulation.
    // Access all circles over the node object
    let svgCircles = [];
    node.attr('circle', function(d) {
      let tmp = {
        x: d.x,
        y: d.y,
        isLand: d.isLand
      };
      svgCircles.push(tmp);
    });

    globalFeatureCollection = convertSvgCirclesToFeatureCol(
        svgCircles
    );
    leafletMap.enableZoom(maps);
  }

  function convertSvgCirclesToFeatureCol(svgCircles) {
    let features = [];
    // Push all circles cx and cy coordinates to an array.
    // Also convert it in a featureCollection of points.
    for(let i = 0; i < svgCircles.length; i++) {
      if(!svgCircles[i].isLand) {
        let cx = svgCircles[i].x;
        let cy = svgCircles[i].y;
        let latLng = maps.layerPointToLatLng([cx, cy]);

        features.push(turf.point([
          latLng.lng,
          latLng.lat
        ]));
      }
    }

    return turf.featureCollection(features);
  }

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

  return simulation;
};

module.exports.force = force;
module.exports.linkForce = linkForce;
module.exports.manyBody = manyBody;
module.exports.collide = collide;
