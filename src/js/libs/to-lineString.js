/*
  ISC License

  Copyright (c) 2017, Stepan Kuzmin
  https://github.com/stepankuzmin/turf-polygon-to-line

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted, provided that the above
  copyright notice and this permission notice appear in all copies.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

// Modified version of Stepan Kuzmins "turf-polygon-to-line".
'use strict';

let normalize = require('turf-normalize');
let turf = require('@turf/turf');

/**
 * Transforms FeatureCollections of type Polygon, MultiPolygons or MultiLineStrings to LineStrings.
 *
 * @name to-lineString
 * @module to-lineString
 * @param {FeatureCollection<(Polygon|MultiPolygon|MultiLineString)>} any FeatureCollection
 * @returns {FeatureCollection<LineString>} FeatureCollection of LineStrings.
 *
 */
module.exports = function(geojson) {
  let features = normalize(geojson).features.map(toLineString);
  return turf.featureCollection(flatten(features));
};

function flatten(array) {
  return [].concat.apply([], array); // eslint-disable-line
}

function polygonToLineString(coordinates, properties) {
  return coordinates.map(function(coordinates) {
    return turf.lineString(coordinates, properties);
  });
}

function multiPolygonToLineString(coordinates, properties) {
  return flatten(coordinates.map(function(coordinates) {
    return polygonToLineString(coordinates, properties);
  }));
}

function toLineString(feature) {
  let geometry = feature.geometry;
  let properties = feature.properties;

  switch (geometry.type) {
    case 'Polygon':
      return polygonToLineString(geometry.coordinates, properties);
      break;
    case 'MultiPolygon':
      return multiPolygonToLineString(geometry.coordinates, properties);
      break;
    case 'MultiLineString':
      return polygonToLineString(geometry.coordinates, properties);
      break;
    default: return feature;
  }
}
