'use strict';

let defaults = {
  'strokeColor': 'rgba(670, 160, 50, 0.8)',
  'pointColor': 'rgba(255, 50, 10, 0.8)',
  'pixelColor': 'rgba(50, 200, 0, 0.8)',
  'mapColor': 'rgba(255, 255, 255, 1)',
  'mapBackgroundColor': 'rgba(0, 0, 0, 1)',
  'width': 320,
  'height': 320
};

let leaflet = {
  'leafletTileStyles': {
    'stamenTonerLight': 0,
    'mapboxStreet': 1
  },
  'tileLayer': 'http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
  'attribution': `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
                  under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.
                  Data by <a href="http://openstreetmap.org">OpenStreetMap</a>,
                  under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.`,
  'maxZoom': 18
};

let force = {
  'pixelSpaceForces': 10,
  'nodeColor': '#00B6F2',
  'landColor': '#11C400',
  'zoomPointRouteColor': '#00B6F2',
  // 'zoomPointLandColor': '#F23C00',
  'zoomPointLandColor': '#11C400',
  'zoomLineColor': '#0073C4',
  'zoomPointRouteSize': 4,
  'zoomPointLandSize': 2,
};

let calcClientRect = function() {
  let heightToolbar = window.document.getElementsByClassName('tool-wrapper')[0].offsetHeight;
  let height = window.innerHeight - heightToolbar;
  let width = window.innerWidth;
  return {height, width};
};

module.exports.defaults = defaults;
module.exports.leaflet = leaflet;
module.exports.force = force;
module.exports.calcClientRect = calcClientRect;
