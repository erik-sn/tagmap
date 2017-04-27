import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

import renderTree from '../d3/tree';

function cleanTagHierarchy(tag, parentName) {
  return Object.assign({}, {
    name: tag.name,
    parent: parentName,
    children: tag.children.map(child => cleanTagHierarchy(child, tag.name)),
  });
}

class TreeDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const node = findDOMNode(this);
    const cleanedTagHierarchy = cleanTagHierarchy(this.props.tag, null);
    renderTree(node, [cleanedTagHierarchy]);
  }


  render() {
    return (
      <div id="tree_display__container" />
    );
  }
}

export default TreeDisplay;
