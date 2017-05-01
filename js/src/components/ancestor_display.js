import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

import renderAncestor from '../d3/ancestor';

function cleanTagDescendants(tag, parentName) {
  return Object.assign({}, {
    name: tag.name,
    parent: parentName,
    children: tag.descendants.map(child => cleanTagDescendants(child, tag.name)),
  });
}

class AncestorDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const node = findDOMNode(this);
    const cleanedTagHierarchy = cleanTagDescendants(this.props.tag, null);
    renderAncestor(node, [cleanedTagHierarchy]);

    let resizeTimer;
    window.onresize = (() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderAncestor(node, [cleanedTagHierarchy]);
      }, 250);
    });
  }

  render() {
    return (
      <div id="ancestor__container" />
    );
  }
}

export default AncestorDisplay;
