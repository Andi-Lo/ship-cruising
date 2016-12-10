"use strict";

let expect = require("../common").expect;
let mercator = require('../../src/js/libs/mercator');
require('babel-polyfill');

describe('#positionToPixel', function() {
  let posToPixel = mercator.posToPixel;
  it('should convert long lat to pixel coordinates', function() {
    let pixel = posToPixel([11.6015625, 50.51342652633956]);
    expect(pixel.x).to.be.a('number');
    expect(pixel.y).to.be.a('number');
    expect(pixel.x).to.not.be.undefined;
    expect(pixel.y).to.not.be.undefined;
    expect(pixel.x).not.to.be.NaN;
    expect(pixel.y).not.to.be.NaN;
  });

  it('requires two numerical arguments', function() {
    expect(() => { posToPixel(['foo', 0]); }).to.throw(Error);
    expect(() => { posToPixel([1, 'bar']); }).to.throw(Error);
    expect(() => { posToPixel([1, 2]); }).to.not.throw(Error);
  });
});

describe('#pixelToPosition', function() {
  let pixelToPos = mercator.pixelToPos;
  it('should convert pixels to long lat coordinates', function() {
    let pos = pixelToPos([11.6015625, 50.51342652633956]);
    expect(pos.x).to.be.a('number');
    expect(pos.y).to.be.a('number');
    expect(pos.x).to.not.be.undefined;
    expect(pos.y).to.not.be.undefined;
    expect(pos.x).not.to.be.NaN;
    expect(pos.y).not.to.be.NaN;
  });

  it('requires two numerical arguments', function() {
    expect(() => { pixelToPos(['foo', 0]); }).to.throw(Error);
    expect(() => { pixelToPos([1, 'bar']); }).to.throw(Error);
    expect(() => { pixelToPos([1, 2]); }).to.not.throw(Error);
  });
});

describe('#calculateScale', function() {
  let calcScale = mercator.calcScale;

  it('should return a number', function() {
    expect(calcScale()).to.be.a("number");
  });

  it('should accept degrees, radians, miles, or kilometers as units', function() {
    expect(() => { calcScale('foo'); }).to.throw(Error);
    expect(() => { calcScale('degrees'); }).to.not.throw(Error);
    expect(() => { calcScale('radians'); }).to.not.throw(Error);
    expect(() => { calcScale('miles'); }).to.not.throw(Error);
    expect(() => { calcScale('kilometers'); }).to.not.throw(Error);
  });
});
