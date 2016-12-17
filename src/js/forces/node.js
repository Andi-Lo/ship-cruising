'use strict';

let turf = require('../libs/turf');
let L = require('leaflet');
let options = require('../modules/options').force;

class Node {
  constructor(coords, latLng, radius = 3) {
    this.x = coords.x;
    this.y = coords.y;
    this.latLng = latLng;
    this.radius = radius;
    this.color = options.nodeColor;
    this.isLand = false;
    return this;
  }

  static getNodes(route, map) {
    let nodes = [];
    let i = 0;
    turf.meta.featureEach(route, function(feature) {
      turf.meta.coordEach(feature, function(coord) {
        let latLng = new L.LatLng(coord[1], coord[0]);
        let pixel = Node.projectPoint(coord[0], coord[1], map);
        let node = new Node(pixel, latLng);
        if(i === 0 || i === feature.geometry.coordinates.length - 1) {
          node.fx = pixel.x;
          node.fy = pixel.y;
        }
        nodes.push(node);
        ++i;
      });
      i = 0;
    });
    return nodes;
  };

  // Use Leaflet to implement a D3 geometric transformation.
  static projectPoint(x, y, map) {
    return map.latLngToLayerPoint(new L.LatLng(y, x));
  };

}

module.exports.Node = Node;
