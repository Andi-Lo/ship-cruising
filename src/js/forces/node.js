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
    let d = [];
    let i = 0;
    turf.meta.coordEach(route, function(coord) {
      let pixel = mercator.posToPixel(coord);
      if(i === 0 || i === route.geometry.coordinates.length-1) {
        d.push(Node.createNode(pixel));
        d[i].fx = pixel.x;
        d[i].fy = pixel.y;
      }
      else {
        d.push(Node.createNode(pixel));
      }
      ++i;
    });
    return d;
  };

}

module.exports.Node = Node;
