'use strict';

let leaflet = require('leaflet');
let options = require('./options');
let bbox = require('../libs/bbox');

let box = [
  -91.14257812499999,
  7.493196470122287,
  -64.8193359375,
  25.839449402063185
];

// Gets initialized in init, with leaflet map
let _map;

let createToneMapDiv = function(map) {
  _map = map;

  // Add Stamen toner tile to leaflet map
  leaflet.tileLayer(options.leaflet.tileLayer, {
    'attribution': options.leaflet.attribution,
    'maxZoom': options.leaflet.maxZoom
  }).addTo(map);
};

let getMap = function() {
  return _map;
};

let init = function(divId, width, height) {
  let div = window.document.getElementById('interactive-map');
  let divLeaflet = document.createElement('div');
  divLeaflet.setAttribute('id', divId);
  divLeaflet.style.width = width + 'px';
  divLeaflet.style.height = height + 'px';
  div.appendChild(divLeaflet);

  // Get center of bbox
  let bounds = bbox(box, width, height);
  let map = leaflet.map(divId, {zoomControl: true})
      .setView([bounds.center[1], bounds.center[0]], bounds.zoom);

  addScaleToMap(map);
  createToneMapDiv(map);
};

let getMetersPerPixel = function(map) {
  // Get the y,x dimensions of the map
  let y = map.getSize().y;
  let x = map.getSize().x;
  // calculate the distance the one side of
  // the map to the other using the haversine formula
  let maxMeters = map.containerPointToLatLng([0, y])
                  .distanceTo( map.containerPointToLatLng([x, y]));
  // calculate how many meters each pixel represents
  return maxMeters/x;
};

function addScaleToMap(map) {
  leaflet.control.scale().addTo(map);
};

let disableZoom = function(map) {
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  map.removeControl(map.zoomControl);
};

let enableZoom = function(map) {
  map.touchZoom.enable();
  map.doubleClickZoom.enable();
  map.scrollWheelZoom.enable();
  map.boxZoom.enable();
  map.keyboard.enable();
  map.addControl(map.zoomControl);
};

module.exports.init = init;
module.exports.getMap = getMap;
module.exports.getMetersPerPixel = getMetersPerPixel;
module.exports.disableZoom = disableZoom;
module.exports.enableZoom = enableZoom;

