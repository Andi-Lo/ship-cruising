var turf = require('./turf');
var draw = require('./draw');

module.exports = function(ctx) {
  var bbox = [
    -87.95654296875,
    9.709057068618208,
    -62.75390625,
    29.19053283229458
  ];

  var cellWidth = 25;
  var units = 'miles';

  var grid = turf.pointGrid(bbox, cellWidth, units);
  // console.log('grid', grid);

  // draw raster map
  fetch('./map/map.geojson').then((parse) => parse.json()).then((props) => {
    turf.meta.featureEach(props, function(feature) {
      var type = feature.geometry.type;

      switch (type) {
        case 'Polygon':
          turf.meta.featureEach(grid, function(polygon) {
            switch (polygon.geometry.type) {
              case "Point":
                if (turf.inside(polygon, feature)) {
                  draw.drawPoint(ctx, polygon.geometry.coordinates, 'rgba(50, 80, 0, 0.4)', 1);
                }
                break;
            }
          });
          break;

        default:
          break;
      }
    });
  });
};
