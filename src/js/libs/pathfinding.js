let astar = require('./astar.js').astar;
let Graph = require('./astar.js').Graph;
let turf = require('./turf');
let mercator = require('./mercator');
let canvasMap = require('../modules/canvasMap');
let drawCanvas = require('../modules/drawCanvas');
let defaults = require('../modules/options').defaults;
let last = require('lodash/array').last;

/**
 * Pathfinding uses the Astar algorithm to find the route.
 * Input has to be a geojson featureCollection containing each harbour as a feature object with long / lat coordinates
 *
 * @name pathfinding
 * @param {FeatureCollection<(LineString|MultiLineString)>}
 * @param {FeatureCollection<Point>}
 * @returns {FeatureCollection<LineString>} the actual route
 */
module.exports = function(fcRoute, fcMap) {
  let feature = turf.iterateFeature(fcRoute);
  let prevPoint = false;
  let lineCollection = [];
  let start = feature.next();
  for(let i = 0; i < (fcRoute.features.length - 1); i++) {
    let next = feature.next();
    if(next.done !== true) {
      let path = findPath(start, next, prevPoint, fcMap);
      prevPoint = last(path.route.geometry.coordinates);
      path = setProperties(path, start, next);
      start = path.prev;
      lineCollection.push(path.route);

      drawCanvas.drawLineString(path.route, defaults.strokeColor, 0, 1);
      drawCanvas.drawPixels(path.route);
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
 *
 * @param {Object} start
 * @param {Object} end
 * @returns {Object} object containing the route and the previous point
 * the last harbour B to serve as the next new start point A
 */
function findPath(start, end, prevPoint, fcMap) {
  let colorData = canvasMap.getColorData(start.value, end.value, fcMap);
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
         Meaning that no path could be found.
         Two of the given harbour points may be equal:
         Given Points:  A long/lat ${mercator.pixelToPos([start.x, start.y])},
                        B long/lat ${mercator.pixelToPos([end.x, end.y])}`
      );
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
