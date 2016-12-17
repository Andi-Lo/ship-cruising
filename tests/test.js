function importTest(name, path) {
  describe(name, function() {
    require(path);
  });
}

var common = require("./common");

describe("Mocha Test Suite", function() {
  beforeEach(function() {

  });

  importTest("mercator.js", './libs/mercator');
  importTest("turf.js", './libs/turf');

  after(function() {

  });
});
