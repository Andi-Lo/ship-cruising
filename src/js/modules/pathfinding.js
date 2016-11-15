let astar = require('../libs/astar.js').astar;
let Graph = require('../libs/astar.js').Graph;
let turf = require('./turf');
let mercator = require('./mercator');
let canvasMap = require('./canvasMap');
let simplifyjs = require('simplify-js');

let colorData = [];

module.exports = function(fc) {
  colorData = canvasMap.getColorData();
  let feature = turf.iterateFeature(fc);

  let start = feature.next();
  let lineCollection = [];

  for(let i = 0; i < (fc.features.length - 1); i++) {
    let next = feature.next();
    if(next.done !== true) {
      let path = findPath(start, next);
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

function findPath(start, end) {
  let graph = new Graph(colorData, {diagonal: true});
  let heuristic = {heuristic: astar.heuristics.diagonal};
  let prev = end;
  let path;

  let getNode = (node) => {
    node = mercator.posToPixel(node.value.geometry.coordinates);
    return graph.grid[node.x][node.y];
  };

  start = getNode(start);
  end = getNode(end);

  try {
    path = astar.search(graph, start, end, heuristic);
    if (path.length <= 0) {
      throw new Error('At least one of the given positions is set falsly');
    }
  }
  catch (error) {
    throw error;
  }
  let route = simplifyPath(path);
  return {route, prev};
};

function simplifyPath(path) {
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
