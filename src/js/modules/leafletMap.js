'use strict';

let L = require('leaflet');
let options = require('./options');
let bbox = require('../libs/bbox');
let calcClientRect = require('../libs/helpers').calcClientRect;

// Gets initialized in init, with leaflet map
let _map;

let createToneMapDiv = function(map) {
  // Add Stamen toner tile to leaflet map
  L.tileLayer(options.leaflet.tileLayer, {
    'attribution': options.leaflet.attribution,
    'maxZoom': options.leaflet.maxZoom
  }).addTo(map);
};

let getMap = function() {
  return _map;
};

function getAttribution() {
  const kevin = {"name": "Kevin Klugmann", "href": "https://twitter.com/kevinklugmann"}; // eslint-disable-line
  const andreas = {"name": "Andreas Lorer", "href": "https://twitter.com/AndreasLorer"}; // eslint-disable-line
  let attribution = document.createElement('div');
  attribution.setAttribute('id', 'attribution');
  attribution.setAttribute('class', 'leaflet-bottom leaflet-left');

  let createLink = (person) => {
    let a = document.createElement('a');
    a.href = person.href;
    a.innerText = person.name;
    a.title = person.name;
    return a;
  };

  attribution.innerHTML = `Map visualization & Routing by: `;
  attribution.appendChild(createLink(andreas));
  attribution.innerHTML += ', ';
  attribution.appendChild(createLink(kevin));
  return attribution;
}

let init = function(width, height) {
  let rect = calcClientRect();
  let div = window.document.getElementById('interactive-map');
  let divLeaflet = document.createElement('div');
  divLeaflet.setAttribute('id', 'tone-map');
  divLeaflet.style.width = rect.width + 'px';
  divLeaflet.style.height = rect.height + 'px';
  divLeaflet.appendChild(getAttribution());
  div.appendChild(divLeaflet);

  _map = L.map('tone-map', {zoomControl: true});
  setView();

  addScaleToMap(_map);
  createToneMapDiv(_map);
};

let setView = function(box = options.defaults.bbox) {
  let rect = calcClientRect();
  let bounds = bbox(box, rect.width, rect.height);
  _map.setView([bounds.center[1], bounds.center[0]], bounds.zoom);
};

function addScaleToMap(map) {
  L.control.scale().addTo(map);
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
module.exports.setView = setView;
module.exports.disableZoom = disableZoom;
module.exports.enableZoom = enableZoom;
