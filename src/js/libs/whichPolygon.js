/*
  ISC License

  Copyright (c) 2017, Mapbox
  http://github.com/mapbox/which-polygon

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

// Modified version of which-polygon
'use strict';

let lineclip = require('lineclip');

module.exports = function(polygon, bbox) {
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
