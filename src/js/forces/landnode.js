'use strict';

let Node = require('./node').Node;
let turf = require('../libs/turf');
let L = require('leaflet');
let options = require('../modules/options').force;

class Landnode extends Node {
  constructor(coords, latLng, radius = 3) {
    super(coords, latLng, radius);
    this.isLand = true;
    this.color = options.landColor;
    return this;
  }

  static getNodes(route, map) {
    let node = [];
    let i = 0;
    turf.meta.coordEach(route, function(coord) {
      // let pixel = mercator.posToPixel(coord);
      let latLng = new L.LatLng(coord[1], coord[0]);
      let pixel = Landnode.projectPoint(coord[0], coord[1], map);
      node.push(new Landnode(pixel, latLng, 2));
      node[i].fx = pixel.x;
      node[i].fy = pixel.y;
      ++i;
    });
    return node;
  };

  // Use Leaflet to implement a D3 geometric transformation.
  static projectPoint(x, y, map) {
    return map.latLngToLayerPoint(new L.LatLng(y, x));
  };

}

module.exports.Landnode = Landnode;
