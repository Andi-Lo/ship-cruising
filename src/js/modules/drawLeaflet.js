'use strict';

let turf = require('./turf');
let drawLeaflet = require('./leafletMap');
let leaflet = require('leaflet');

let drawPolyline = function(featureCollection) {
  turf.meta.featureEach(featureCollection, function(feature) {
    let swappedCords = turf.flip(feature);
    let maps = drawLeaflet.getMaps();

    for(let i = 0; i < maps.length; i++) {
      leaflet.polyline(swappedCords.geometry.coordinates, {color: 'red'})
             .addTo(maps[i]);
    }
  });
};

module.exports.drawPolyline = drawPolyline;
