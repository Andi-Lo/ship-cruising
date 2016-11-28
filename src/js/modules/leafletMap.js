'use strict';

let leaflet = require('leaflet');
let defaults = require('./options').defaults;
let leafletOptions = require('./options').leaflet;
let leafletTileStyles = require('./options').leafletTileStyles;
let bbox = require('../libs/bbox');

let box = [
  -91.14257812499999,
  7.493196470122287,
  -64.8193359375,
  25.839449402063185
];

// Gets initialized in init, with leaflet map
let maps = [];

const cssSizeUnit = 'px';

let createToneMapDiv = function(elementInteractive, divId, map) {
  // Add map to map array
  maps.push(map);
  // Add Stamen toner tile to leaflet map
  leaflet.tileLayer('http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
    attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
                  under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.
                  Data by <a href="http://openstreetmap.org">OpenStreetMap</a>,
                  under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.`,
    maxZoom: 18
  }).addTo(map);
};

let createMapboxMapDiv = function(elementInteractive, divId, map) {
  // Add map to map array
  maps.push(map);

  // Add OpenStreetMap tiles
  leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'pk.' +
                'eyJ1Ijoia2V2aW5rbCIsImEiOiJjaXZ' +
                'pNnB2aWowMDljMm9xZGNzNWt0NXk0In0.' +
                'bneQSkZQkVBBKl2-YZX43Q'
  }).addTo(map);
};

let getMaps = function() {
  return maps;
};

let init = function(elementInteractive, divId,
              divWidth = defaults.width,
              divHeight = defaults.height) {
  // Create new leaflet div with a css class
  // Like in the tutorial
  let divLeaflet = document.createElement('div');
  divLeaflet.setAttribute('id', divId);
  divLeaflet.style.width = divWidth + cssSizeUnit;
  divLeaflet.style.height = divHeight + cssSizeUnit;
  elementInteractive.appendChild(divLeaflet);

  // Get center of bbox
  let bounds = bbox(box, defaults.width, defaults.height);
  let map = leaflet.map(divId)
      .setView([bounds.center[1], bounds.center[0]], bounds.zoom);

  addScaleToMap(map);

  // Set the chosen tiles default style
  let defaultStyle = leafletOptions.defaultTileStyle;
  if(defaultStyle === leafletTileStyles.stamenTonerLight) {
    createToneMapDiv(elementInteractive, divId, map);
  }
  else if(defaultStyle === leafletTileStyles.mapboxStreet) {
    createMapboxMapDiv(elementInteractive, divId, map);
  }
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

module.exports.init = init;
module.exports.getMaps = getMaps;
module.exports.getMetersPerPixel = getMetersPerPixel;
