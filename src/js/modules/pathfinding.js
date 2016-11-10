var astar = require('../libs/astar.js');
var turf = require('./turf');
var mercator = require('./mercator');
var simplifyjs = require('simplify-js');
var geojsonTidy = require('geojson-tidy');
var draw = require('./draw');

module.exports = function(canvas, colorData, start, end) {
  var graph = new astar.Graph(colorData, {diganoal: true});
  var start = graph.grid[start.x][start.y];
  var end = graph.grid[end.x][end.y];
  var result = astar.astar.search(graph, start, end);

  var simplified = simplify(result);
  var linestring = turf.lineString(simplified);

  draw.drawLineString(canvas, linestring);
  draw.drawPixels(canvas, simplified);
  return result;
};

function simplify(data, tolerance = 3) {
  // change data format to [{num.x, num.y},{..},{.}] for simplify func
  var longLat = [];
  data.forEach((pixelPos) => {
    longLat.push({'x': pixelPos.x, 'y': pixelPos.y});
  });

  var simplified = simplifyjs(longLat, tolerance, true);

  // get the data back to format [[0 => long, 1 => lat], .., .]
  var toArray = [];
  simplified.forEach((obj) => {
    coord = mercator.pixelToPos([obj.x, obj.y]);
    toArray.push([coord[0], coord[1]]);
  });

  return toArray;
};
