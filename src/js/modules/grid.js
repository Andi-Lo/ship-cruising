var turf = require('@turf/turf');
var draw = require('./draw');

module.exports = function(ctx) {
  var bbox = [-87.95654296875, 9.709057068618208, -62.75390625, 29.19053283229458];

  var cellWidth = 25;
  var units = 'miles';

  var grid = turf.pointGrid(bbox, cellWidth, units);

  fetch('./map/map.geojson').then((res) => res.json()).then((geo) => {
    var count = 0;
    // draw map
    geo.features.forEach((feat) => {
      const {type, coordinates} = feat.geometry;

      switch (type) {

      case "Polygon":
        grid.features.forEach((feature) => {
          const {type, coordinates} = feature.geometry;
          switch (type) {
          case "Point":
            if(turf.inside(feature, feat)) {
              draw.drawPoint(ctx, coordinates, 'rgba(50, 80, 0, 0.4)', 0.1);
            }
          }
        });
        break;
      }
    });
  });
};
