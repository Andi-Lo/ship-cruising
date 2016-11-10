let astar = require('../libs/astar.js');
let turf = require('./turf');
let mercator = require('./mercator');
let simplifyjs = require('simplify-js');
let geojsonTidy = require('geojson-tidy');
let draw = require('./draw');

module.exports = function(canvas, colorData, start, end) {
  let graph = new astar.Graph(colorData, {diganoal: true});
  start = graph.grid[start.x][start.y];
  end = graph.grid[end.x][end.y];
  let result = astar.astar.search(graph, start, end);

  let simplified = simplify(result);
  let linestring = turf.lineString(simplified);

  draw.drawLineString(canvas, linestring);
  draw.drawPixels(canvas, simplified);
  return result;
};

function simplify(data, tolerance = 3) {
  // change data format to [{num.x, num.y},{..},{.}] for simplify func
  let longLat = [];
  data.forEach((pixelPos) => {
    longLat.push({'x': pixelPos.x, 'y': pixelPos.y});
  });

  let simplified = simplifyjs(longLat, tolerance, true);

  // get the data back to format [[0 => long, 1 => lat], .., .]
  let toArray = [];
  simplified.forEach((obj) => {
    coord = mercator.pixelToPos([obj.x, obj.y]);
    toArray.push([coord[0], coord[1]]);
  });

  return toArray;
};
