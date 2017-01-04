'use strict';

let Observer = require('./observer').Observer;
let leafletMap = require('../modules/leafletMap');
let L = require('leaflet');

class LeafletObserver extends Observer {
  constructor() {
    super();
  }

  onMapZoom() {
    let map = leafletMap.getMap();
    map.on('click', this.onMapClick);
    map.on('zoomend', function(e) {
      land.calculateLandInit(land._land);
    });
  }

  onMapClick(e) {
    let map = leafletMap.getMap();
    let popup = L.popup();
    popup.setLatLng(e.latlng)
         .setContent("You clicked the map at " + e.latlng.toString())
         .openOn(map);
    console.log("Clicked at: ", e.latlng.toString());
  }
}

module.exports.LeafletObserver = LeafletObserver;
