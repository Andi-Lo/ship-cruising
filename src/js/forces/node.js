'use strict';

let turf = require('../libs/turf');
let L = require('leaflet');
let options = require('../modules/options').force;

class Node {
  constructor() {

  }

  static createNode(coords, latLng, hexColor, isLand, radius = 3) {
    return {
      radius: radius,
      x: coords.x,
      y: coords.y,
      latLng: latLng,
      color: hexColor,
      isLand: isLand
    };
  };

  static getNodes(route, map) {
    let node = [];
    let i = 0;
    turf.meta.coordEach(route, function(coord) {
      // let pixel = mercator.posToPixel(coord);
      let latLng = new L.LatLng(coord[1], coord[0]);
      let pixel = Node.projectPoint(coord[0], coord[1], map);
      if('geometry' in route) {
        if(i === 0 || i === route.geometry.coordinates.length - 1) {
          node.push(Node.createNode(pixel, latLng, options.nodeColor, false));
          node[i].fx = pixel.x;
          node[i].fy = pixel.y;
        }
        else {
          node.push(Node.createNode(pixel, latLng, options.nodeColor, false));
        }
      }
      else {
        node.push(Node.createNode(pixel, latLng, options.landColor, true, 2));
        node[i].fx = pixel.x;
        node[i].fy = pixel.y;
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
