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

  static getNodes(route) {
    let node = [];
    let i = 0;
    turf.meta.coordEach(route, function(coord) {
      let pixel = mercator.posToPixel(coord);
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

}

module.exports.Node = Node;
