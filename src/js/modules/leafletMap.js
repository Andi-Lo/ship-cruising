'use strict';

let leaflet = require('leaflet');
let defaults = require('./options').defaults;
let bbox = require('./bbox');

let box = [
  -91.14257812499999,
  7.493196470122287,
  -64.8193359375,
  25.839449402063185
];

// Gets initialized in init, with leaflet map
let maps = [];
const cssSizeUnit = 'px';

let createToneMapDiv = function(elementInteractive, divId) {
  let map = init(elementInteractive, divId);

  // Add map to map array
  maps.push(map);
  // Add Stamen toner tile to leaflet map
  leaflet.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
                  'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
                  'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
                  'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    maxZoom: 18
  }).addTo(map);
};

let createMapboxMapDiv = function(elementInteractive, divId) {
  let map = init(elementInteractive, divId);

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

let drawPolyline = function(coords) {
  // Create a red polyline from an array of LatLng points
  let swapedCoords = swapLongLat(coords);

  for(let i = 0; i < maps.length; i++) {
    leaflet.polyline(swapedCoords, {color: 'red'}).addTo(maps[i]);
  }
};

function init(elementInteractive, divId) {
  // Create new leaflet div with a css class
  // Like in the tutorial
  let divLeaflet = document.createElement('div');
  divLeaflet.setAttribute('id', divId);
  divLeaflet.style.width = defaults.width + cssSizeUnit;
  divLeaflet.style.height = defaults.height + cssSizeUnit;
  elementInteractive.appendChild(divLeaflet);

  // Get center of bbox
  let bounds = bbox(box, defaults.width, defaults.height);
  return leaflet.map(divId)
      .setView([bounds.center[1], bounds.center[0]], bounds.zoom);
};

function swapLongLat(coords) {
  let tmpFeatures = [];
  for(let i = 0; i < coords.length; i++) {
    tmpFeatures.push([coords[i][1], coords[i][0]]);
  }

  return tmpFeatures;
};

module.exports.createToneMapDiv = createToneMapDiv;
module.exports.createMapboxMapDiv = createMapboxMapDiv;
module.exports.drawPolyline = drawPolyline;
