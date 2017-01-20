'use strict';

let defaults = {
  'strokeColor': 'rgba(670, 160, 50, 0.8)',
  'pointColor': 'rgba(255, 50, 10, 0.8)',
  'pixelColor': 'rgba(50, 200, 0, 0.8)',
  'mapColor': 'rgba(255, 255, 255, 1)',
  'routeColor': '#3388ff',
  'mapBg': 'rgba(0, 0, 0, 1)',
  'width': 512/2,
  'height': 512/2,
  'bbox': [
    -77.34374999999999,
    9.44906182688142,
    12.3046875,
    49.15296965617042
  ]
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
  'zoomPointLandColor': '#11C400',
  'zoomLineColor': '#0073C4',
  'zoomPointRouteSize': 4,
  'zoomPointLandSize': 2,
};

module.exports.defaults = defaults;
module.exports.leaflet = leaflet;
module.exports.force = force;
