var astar = require('../libs/astar.js');
var turf = require('./turf');
var simplify = require('simplify-js');
var draw = require('./draw');

module.exports = function(canvas, colorData, start, end) {
  var graph = new astar.Graph(colorData, {diganoal: true});
  var start = graph.grid[start.x][start.y];
  var end = graph.grid[end.x][end.y];
  var result = astar.astar.search(graph, start, end);

  var simple = tidy(result);
  draw.drawPixels(canvas, simple);

  return result;
};

function tidy(data, tolerance = 1) {
  // change data format to [{num.x, num.y},{..},{.}] for simplify func
  var longLat = [];
  data.forEach((pixelPos) => {
    longLat.push({'x': pixelPos.x, 'y': pixelPos.y});
  });

  var simplified = simplify(longLat, tolerance, true);

  // get the data back to format [[0 => long, 1 => lat], .., .]
  var toArray = [];
  simplified.forEach((obj) => {
    toArray.push([obj.x, obj.y]);
  });

  return toArray;
};
