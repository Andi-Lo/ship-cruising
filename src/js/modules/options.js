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

let leafletTileStyles = {
  'stamenTonerLight': 0,
  'mapboxStreet': 1
};

let leaflet = {
  'defaultTileStyle': leafletTileStyles.stamenTonerLight
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

module.exports.defaults = defaults;
module.exports.leaflet = leaflet;
module.exports.leafletTileStyles = leafletTileStyles;
module.exports.force = force;
