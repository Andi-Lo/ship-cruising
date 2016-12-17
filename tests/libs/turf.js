"use strict";

let expect = require("../common").expect;
let turf = require('../../src/js/libs/turf');

let fc = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -77.926025390625,
          18.46918890441719
        ]
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -75.82763671875,
          19.9526963975442
        ]
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -82.37548828125,
          23.140359987886118
        ]
      }
    }
  ]
};

describe('#iterateFeature', function() {
  it('should fail on negative start value', function() {
    expect(() => {
      let iterator = turf.iterateFeature(fc, -1);
      iterator.next();
    }).to.throw(Error);
  });

  it('should fail when start === end value', function() {
    expect(() => {
      let iterator = turf.iterateFeature(fc, 1, 1);
      iterator.next();
    }).to.throw(Error);
  });

  it('value should be undefined when end < -1', function() {
    let iterator = turf.iterateFeature(fc, 1, -2);
    expect(iterator.next().value).to.be.undefined;
  });

  it('should return a feature beginning at start', function() {
    let iterator = turf.iterateFeature(fc, 1, 2);
    let next = iterator.next().value.geometry.coordinates;
    expect(next[0]).to.equal(-75.82763671875);
    expect(next[1]).to.equal(19.9526963975442);
  });

  it('should return each feature of a featureCollection', function() {
    let iterator = turf.iterateFeature(fc);
    turf.meta.featureEach(fc, function(feature) {
      let next = iterator.next().value;
      expect(feature).to.equal(next);
    });
    expect(iterator.next().done).to.be.true;
  });

  it('should not fail for a too large end value', function() {
    let iterator = turf.iterateFeature(fc, 0, 200123);
    turf.meta.featureEach(fc, function(feature) {
      let next = iterator.next().value;
      expect(feature).to.equal(next);
    });
  });

  it('next() should return a feature', function() {
    let iterator = turf.iterateFeature(fc);
    expect(iterator.next().value.type).to.equal('Feature');
  });
});
