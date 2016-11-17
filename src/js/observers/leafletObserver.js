'use strict';

let Observer = require('./observer').Observer;
let leafletMap = require('../modules/leafletMap');
let L = require('leaflet');

class LeafletObserver extends Observer {
  constructor() {
    super();
    let maps = leafletMap.getMaps();
    maps[0].on('click', this.onMapClick);
  }

  onMapClick(e) {
    let maps = leafletMap.getMaps();
    let popup = L.popup();
    popup.setLatLng(e.latlng)
         .setContent("You clicked the map at " + e.latlng.toString())
         .openOn(maps[0]);
    console.log("Clicked at: ", e.latlng.toString());
  }
}

module.exports.LeafletObserver = LeafletObserver;
