let astar = require('../libs/astar.js');
let turf = require('./turf');
let mercator = require('./mercator');
let simplifyjs = require('simplify-js');

module.exports = function(canvas, colorData, fc) {
  let feature = turf.iterateFeature(fc);

  let start = feature.next();
  let lineCollection = [];

  for(let i = 0; i < (fc.features.length - 1); i++) {
    let next = feature.next();
    if(next.done !== true) {
      let path = calcRoute(start, next, colorData);
      start = path.prev;
      lineCollection.push(path.route);
    }
    else {
      break;
    }
  }
  lineCollection = turf.featureCollection(lineCollection);
  return lineCollection;
};

function calcRoute(start, end, colorData) {
  let graph = new astar.Graph(colorData, {diagonal: true});
  let heuristic = {heuristic: astar.astar.heuristics.diagonal};
  let prev = end;
  let path;

  start = mercator.posToPixel(start.value.geometry.coordinates);
  start = graph.grid[start.x][start.y];

  end = mercator.posToPixel(end.value.geometry.coordinates);
  end = graph.grid[end.x][end.y];

  try {
    path = astar.astar.search(graph, start, end, heuristic);
    if (path.length <= 0) {
      throw new Error(
          'At least one of the given positions is set falsly'
        );
    }
  }
  catch (error) {
    throw error;
  }

  // let path = astar.astar.search(graph, start, end, heuristic);
  let route = simplifyRoute(path);

  return {route, prev};
}

function simplifyRoute(path) {
  let simplified = simplify(path);
  let linestring = turf.lineString(simplified);

  const resolution = 10000;
  const sharpness = .4;
  let bezier = turf.bezier(linestring, resolution, sharpness);
  let bezierSimplified = turf.simplify(bezier, 0.01, false);

  return bezierSimplified;
};

function simplify(path, tolerance = 4) {
  // change path format to [{num.x, num.y},{..},{.}] for simplify func
  let longLat = [];
  path.forEach((pixelPos) => {
    longLat.push({'x': pixelPos.x, 'y': pixelPos.y});
  });

  let simplified = simplifyjs(longLat, tolerance, true);

  // get the path back to format [[0 => long, 1 => lat], .., .]
  let toArray = [];
  simplified.forEach((obj) => {
    coord = mercator.pixelToPos([obj.x, obj.y]);
    toArray.push([coord[0], coord[1]]);
  });

  return toArray;
};
