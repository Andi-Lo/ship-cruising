var astar = require('../libs/astar.js');

module.exports = function(canvas, colorData, start, end) {
  var graph = new astar.Graph(colorData);
  var start = graph.grid[start.x][start.y];
  var end = graph.grid[end.x][end.y];
  var result = astar.astar.search(graph, start, end);

  drawPixels(canvas, result);

  return result;
};

function drawPixels(canvas, path, color = 'rgba(670, 160, 50, 0.8)') {
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  path.forEach((pixel) => {
    ctx.fillRect(pixel.x, pixel.y, 2, 2);
  });
};
