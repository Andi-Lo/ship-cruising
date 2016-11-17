'use strict';

let turf = require('./turf');
let leafletMap = require('./leafletMap');
let leaflet = require('leaflet');

let drawPolyline = function(featureCollection) {
  turf.meta.featureEach(featureCollection, function(feature) {
    let swappedCords = turf.flip(feature);
    let maps = leafletMap.getMaps();

    for(let i = 0; i < maps.length; i++) {
      leaflet.polyline(swappedCords.geometry.coordinates, {color: 'red'})
             .addTo(maps[i]);
    }
  });
};

let drawMarkers = function(featureCollection) {
  let maps = leafletMap.getMaps();

  turf.meta.featureEach(featureCollection, function(feature) {
    let coord = turf.invariant.getCoord(turf.flip(feature));
    let marker = leaflet.marker(coord).addTo(maps[0]);
    marker.bindPopup("<b>" + feature.properties.name + "</b>").openPopup();
  });
};

module.exports.drawPolyline = drawPolyline;
module.exports.drawMarkers = drawMarkers;
