'use strict';

// This code is from the npm package "which-polygon"
// http://github.com/mapbox/which-polygon
let polygonIntersectsBBox = function(polygon, bbox) {
  let bboxCenter = [
    (bbox[0] + bbox[2]) / 2,
    (bbox[1] + bbox[3]) / 2
  ];
  if (insidePolygon(polygon, bboxCenter)) return true;
  for (let i = 0; i < polygon.length; i++) {
    if (lineclip(polygon[i], bbox).length > 0) return true;
  }
  return false;
};

// ray casting algorithm for detecting if point is in polygon
function insidePolygon(rings, p) {
  let inside = false;
  for (let i = 0, len = rings.length; i < len; i++) {
    let ring = rings[i];
    for (let j = 0, len2 = ring.length, k = len2 - 1; j < len2; k = j++) {
      if (rayIntersect(p, ring[j], ring[k])) inside = !inside;
    }
  }
  return inside;
}

function rayIntersect(p, p1, p2) {
  return ((p1[1] > p[1]) !== (p2[1] > p[1])) && (p[0] < (p2[0] - p1[0]) * (p[1] - p1[1]) / (p2[1] - p1[1]) + p1[0]);
}

module.exports.polygonIntersectsBBox = polygonIntersectsBBox;
