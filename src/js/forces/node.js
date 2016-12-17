'use strict';

let turf = require('../libs/turf');
let L = require('leaflet');
let options = require('../modules/options').force;

class Node {
  constructor(coords, latLng, radius = 3) {
    this._x = coords.x,
    this._y = coords.y,
    this._latLng = latLng;
    this._radius = radius;
    this._color = options.nodeColor;
    this._isLand = false;
    return this;
  }

  set color(val) { this._color = val; }
  get color() { return this._color; }

  set x(val) { this._x = val; }
  get x() { return this._x; }

  set y(val) { this._y = val; }
  get y() { return this._y; }

  set latLng(val) { this._latLng = val; }
  get latLng() { return this._latLng; }

  set radius(val) { this._radius = val; }
  get radius() { return this._radius; }

  get isLand() { return this._isLand; }

  static getNodes(route, map) {
    let node = [];
    let i = 0;

    turf.meta.featureEach(route, function(feature) {
      turf.meta.coordEach(feature, function(coord) {
        let latLng = new L.LatLng(coord[1], coord[0]);
        let pixel = Node.projectPoint(coord[0], coord[1], map);
        node.push(new Node(pixel, latLng));
        if(i === 0 || i === feature.geometry.coordinates.length - 1) {
          node[i].fx = pixel.x;
          node[i].fy = pixel.y;
        }
        ++i;
      });
    });

    return node;
  };

  // Use Leaflet to implement a D3 geometric transformation.
  static projectPoint(x, y, map) {
    return map.latLngToLayerPoint(new L.LatLng(y, x));
  };

}

module.exports.Node = Node;
