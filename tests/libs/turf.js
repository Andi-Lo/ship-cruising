"use strict";

let expect = require("../common").expect;
let turf = require('../../src/js/libs/turf');

let fcPoint = turf.random('points', 50);

let linestring1 = turf.lineString([
  [-21.964416, 64.148203],
  [-21.956176, 64.141316],
  [-21.93901, 64.135924],
  [-21.927337, 64.136673]
]);
let linestring2 = turf.lineString([
  [-21.929054, 64.127985],
  [-21.912918, 64.134726],
  [-21.916007, 64.141016],
  [-21.930084, 64.14446]
], {name: 'line 1', distance: 145});

let fcLineString = turf.featureCollection([linestring1, linestring2]);

describe('#iterateFeature', function() {
  it('should fail on negative start value', function() {
    expect(() => {
      let iterator = turf.iterateFeature(fcPoint, -1);
      iterator.next();
    }).to.throw(Error);
  });

  it('should fail when start === end value', function() {
    expect(() => {
      let iterator = turf.iterateFeature(fcPoint, 1, 1);
      iterator.next();
    }).to.throw(Error);
  });

  it('value should be undefined when end < -1', function() {
    let iterator = turf.iterateFeature(fcPoint, 1, -2);
    expect(iterator.next().value).to.be.undefined;
  });

  it('should return each feature of a featureCollection', function() {
    let iterator = turf.iterateFeature(fcPoint);
    turf.meta.featureEach(fcPoint, function(feature) {
      let next = iterator.next().value;
      expect(feature).to.equal(next);
    });
    expect(iterator.next().done).to.be.true;
  });

  it('should not fail for a too large end value', function() {
    let iterator = turf.iterateFeature(fcPoint, 0, 200123);
    turf.meta.featureEach(fcPoint, function(feature) {
      let next = iterator.next().value;
      expect(feature).to.equal(next);
    });
  });

  it('next() should return a feature', function() {
    let iterator = turf.iterateFeature(fcPoint);
    expect(iterator.next().value.type).to.equal('Feature');
  });
});

describe('#fixLineString', function() {
  it('should return a featureCollection', function() {
    let featureCollection = turf.fixLineString(fcLineString);
    expect(featureCollection.type).to.equal('FeatureCollection');
  });
  it('should add the start point as new end point if they are !=', function() {
    let featureCollection = turf.fixLineString(fcLineString);
    turf.meta.featureEach(featureCollection, function(feature) {
      let length = feature.geometry.coordinates.length;
      let start = feature.geometry.coordinates[0];
      let end = feature.geometry.coordinates[length-1];
      expect(start[0]).to.equal(end[0]);
      expect(start[1]).to.equal(end[1]);
    });
  });

  it('should throw an error on wrong geometry type', function() {
    expect(() => { turf.fixLineString(fcPoint).to.throw(Error); });
  });
});
