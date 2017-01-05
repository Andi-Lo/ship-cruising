let normalize = require('turf-normalize');
let turf = require('turf');

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

/**
 * Transforms Polygons and MultiPolygons to LineStrings.
 *
 * @module turf/polygonToLine
 * @category transformation
 * @param {Object} geojson any GeoJSON object
 * @returns {Object} FeatureCollection where
 * Polygons and MultiPolygons transformed to LineStrings.
 */
module.exports = function(geojson) {
  let features = normalize(geojson).features.map(toLineString);
  return turf.featureCollection(flatten(features));
};
