var PF = require('pathfinding');
var rgb2hex = require('rgb2hex');
var astar = require('../libs/astar.js');

module.exports = function(canvas, colorData, start, end) {
  var ctx = canvas.getContext('2d');
  var grid = new PF.Grid(colorData);

  findPath(ctx, colorData, start, end);
};

function drawPixels(ctx, path) {
  ctx.fillStyle = 'rgba(670, 160, 50, 0.8)';
  path.forEach((pixel) => {
    ctx.fillRect(pixel.x, pixel.y, 2, 2);
  });
};

function findPath(ctx, colorData, start, end) {
  var graph = new astar.Graph(colorData);
  var start = graph.grid[start.x][start.y];
  var end = graph.grid[end.x][end.y];
  var result = astar.astar.search(graph, start, end);
  drawPixels(ctx, result);
};
