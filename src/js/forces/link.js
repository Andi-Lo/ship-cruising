'use strict';

class Link {
  constructor() {

  }

  static getLinks(nodes) {
    let next = 1;
    let prev = 0;
    let link = [];
    while(next < nodes.length) {
      link.push({source: prev, target: next});
      prev = next;
      ++next;
    }
    return link;
  }
}

module.exports.Link = Link;
