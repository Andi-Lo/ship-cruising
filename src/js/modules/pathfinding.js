let astar = require('../libs/astar.js');
let turf = require('./turf');
let mercator = require('./mercator');
let simplifyjs = require('simplify-js');

module.exports = function(canvas, colorData, fc) {
  console.log('fc', fc);
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
  console.log('lineCollection', lineCollection);
  return lineCollection;
};

function calcRoute(start, end, colorData) {
  let graph = new astar.Graph(colorData, {diagonal: true});
  let heuristic = {heuristic: astar.astar.heuristics.diagonal};
  let route = [];
  let prev = end;

  start = mercator.posToPixel(start.value.geometry.coordinates);
  start = graph.grid[start.x][start.y];

  end = mercator.posToPixel(end.value.geometry.coordinates);
  end = graph.grid[end.x][end.y];

  let path = astar.astar.search(graph, start, end, heuristic);
  route.push(simplifyRoute(path));

  return {route, prev};
}

function simplifyRoute(path) {
  let simplified = simplify(path);
  let linestring = turf.lineString(simplified);

  const resolution = 10000;
  const sharpness = .4;
  let bezier = turf.bezier(linestring, resolution, sharpness);

  return turf.simplify(bezier, 0.01, false);
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
