var turf = require('@turf/turf');
var draw = require('./draw');

module.exports = function(ctx) {
  var bbox = [-87.95654296875, 9.709057068618208, -62.75390625, 29.19053283229458];

  var cellWidth = 25;
  var units = 'miles';

  var grid = turf.pointGrid(bbox, cellWidth, units);

  console.log('grid', grid);

  grid.features.forEach((features) => {
    const {type, coordinates} = features.geometry;

    switch (type) {

    case "Point":
      draw.drawPoint(ctx, coordinates, 'rgba(50, 80, 0, 0.4)', 0.1);
      break;

    }
  });
};
