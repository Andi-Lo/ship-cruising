'use strict';

let turf = require('./turf');
let drawLeaflet = require('./leafletMap');
let leaflet = require('leaflet');


let drawPolyline = function(coords) {
  // Create a red polyline from an array of LatLng points
  let swappedCords = turf.flip(coords);
  let maps = drawLeaflet.getMaps();

  for(let i = 0; i < maps.length; i++) {
    leaflet.polyline(swappedCords.geometry.coordinates, {color: 'red'})
            .addTo(maps[i]);
  }
};

module.exports.drawPolyline = drawPolyline;
