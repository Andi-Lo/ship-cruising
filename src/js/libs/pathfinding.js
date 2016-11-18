let astar = require('./astar.js').astar;
let Graph = require('./astar.js').Graph;
let turf = require('./turf');
let mercator = require('./mercator');
let canvasMap = require('../modules/canvasMap');
let simplifyjs = require('simplify-js');
var _ = require('lodash/array');

let colorData = [];

/**
 * Pathfinding uses the Astar algorithm to find the
 * route. Input has to be a geojson featureCollection containing each
 * harbour as a feature object with long / lat coordinates
 * @param {any} featureCollection
 * @returns returns a featureCollection containing lineString features
 */
module.exports = function(featureCollection) {
  colorData = canvasMap.getColorData();
  let feature = turf.iterateFeature(featureCollection);
  let prevPoint = false;
  let lineCollection = [];
  let start = feature.next();

  for(let i = 0; i < (featureCollection.features.length - 1); i++) {
    let next = feature.next();
    if(next.done !== true) {
      let path = findPath(start, next, prevPoint);
      prevPoint = _.last(path.route.geometry.coordinates);
      path.route.properties.name = 'route';
      path.route.properties.start = start.value.geometry.coordinates;
      path.route.properties.end = next.value.geometry.coordinates;
      start = path.prev;
      lineCollection.push(path.route);
    }
    else {
      break;
    }
  }
  return turf.featureCollection(lineCollection);
};

/**
 * Use astar to find path from "start" to "end"
 * @param {any} start
 * @param {any} end
 * @returns an {route, prev} object containing the path A to B and the last harbour B
 */
function findPath(start, end, prevPoint) {
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
  if(prevPoint !== false) route.geometry.coordinates[0] = prevPoint;
  return {route, prev};
};


/**
 * Creates a smooth bezier curve and simplifies it
 * @param {any} path
 * @param {any} prevPoint
 * @param {number} [sharpness=0.4]
 * @returns bezier curve feature of type lineString
 * TODO: parameterize function for later control usage. Probably use some
 * form of option object to not get an endless list of parameters
 */
function simplifyPath(path, sharpness = 0.4) {
  let simplified = simplify(path);
  let linestring = turf.lineString(simplified);

  const resolution = 10000;
  let bezier = turf.bezier(linestring, resolution, sharpness);
  let bezierSimplified = turf.simplify(bezier, 0.01, false);

  return bezierSimplified;
};

/**
 * Simplify uses simplify-js to compress the route to a smaller dataset using
 * a pixel tolerance as a parameter.
 * @param {any} path
 * @param {number} [tolerance=3]
 * @returns an array containing the simplified data set
 */
function simplify(path, tolerance = 3) {
  // change path format from [[x,y],[..],[.]] to [{x, y},{..},{.}] for simplify func
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
