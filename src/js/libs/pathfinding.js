let astar = require('./astar.js').astar;
let Graph = require('./astar.js').Graph;
let turf = require('./turf');
let mercator = require('./mercator');
let canvasMap = require('../modules/canvasMap');
let _ = require('lodash/array');

/**
 * Pathfinding uses the Astar algorithm to find the
 * route. Input has to be a geojson featureCollection containing each
 * harbour as a feature object with long / lat coordinates
 * @param {any} featureCollection
 * @returns returns a featureCollection containing lineString features
 */
module.exports = function(fc) {
  let feature = turf.iterateFeature(fc);
  let prevPoint = false;
  let lineCollection = [];
  let start = feature.next();
  for(let i = 0; i < (fc.features.length - 1); i++) {
    let next = feature.next();
    if(next.done !== true) {
      let path = findPath(start, next, prevPoint);
      prevPoint = _.last(path.route.geometry.coordinates);
      path = setProperties(path, start, next);
      start = path.prev;
      lineCollection.push(path.route);
    }
  }
  return turf.featureCollection(lineCollection);
};

function setProperties(path, start, next) {
  path.route.properties.name = 'route';
  path.route.properties.start = start.value.geometry.coordinates;
  path.route.properties.end = next.value.geometry.coordinates;

  return path;
};

/**
 * Use astar to find path from "start" to "end"
 * @param {any} start
 * @param {any} end
 * @returns an {route, prev} object containing the path A to B and
 * the last harbour B to serve as the next new start point A
 */
function findPath(start, end, prevPoint) {
  let colorData = canvasMap.getColorData();
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
      throw new Error(`At least one of the given positions is set falsly.
         Meaning that one of the given points might lay inside of Land`);
    }
  }
  catch (error) {
    throw error;
  }
  let route = gridNodeToLinestring(path);
  if(prevPoint !== false) route.geometry.coordinates[0] = prevPoint;
  return {route, prev};
};


function gridNodeToLinestring(gridNodes) {
  let lineString = [];
  gridNodes.forEach((node) => {
    let coord = mercator.pixelToPos([node.x, node.y]);
    lineString.push([coord[0], coord[1]]);
  });
  return turf.lineString(lineString);
}
