'use strict';

let mercator = require('../libs/mercator');
let turf = require('../libs/turf');

class Node {
  constructor() {

  }

  static createNode(coords) {
    return {
      radius: 3,
      x: coords.x,
      y: coords.y,
    };
  };

  static getNodes(route, map) {
    let node = [];
    let i = 0;
    turf.meta.coordEach(route, function(coord) {
      // let pixel = mercator.posToPixel(coord);
      let pixel = Node.projectPoint(coord[0], coord[1], map);
      if(i === 0 || i === route.geometry.coordinates.length-1) {
        node.push(Node.createNode(pixel));
        node[i].fx = pixel.x;
        node[i].fy = pixel.y;
      }
      else {
        node.push(Node.createNode(pixel));
      }
      ++i;
    });
    return node;
  };

  // Use Leaflet to implement a D3 geometric transformation.
  static projectPoint(x, y, map) {
    return map.latLngToLayerPoint(new L.LatLng(y, x));
  };

}

module.exports.Node = Node;
