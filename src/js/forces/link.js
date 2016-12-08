'use strict';

class Link {
  constructor() {

  }

  static getLinks(nodes) {
    let next = 1;
    let prev = 0;
    let obj = [];
    while(next < nodes.length) {
      obj.push({source: prev, target: next});
      prev = next;
      ++next;
    }
    return obj;
  }
}

module.exports.Link = Link;
