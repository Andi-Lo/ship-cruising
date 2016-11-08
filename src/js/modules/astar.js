var PF = require('pathfinding');
var rgb2hex = require('rgb2hex');

module.exports = function(canvas, colorData, x, y, firstClick) {
  var ctx = canvas.getContext('2d');
  var grid = new PF.Grid(colorData);

  var finder = new PF.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true
  });

  var path = finder.findPath(x, y, firstClick.x, firstClick.y, grid);
  drawPixels(ctx, path);
};

function drawPixels(ctx, path) {
  ctx.fillStyle = 'rgba(55, 0, 200, 0.8)';
  path.forEach((pixel) => {
    ctx.fillRect(pixel[0], pixel[1], 2, 2);
  });
};
