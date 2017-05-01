import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

import renderTree from '../d3/tree';

class AncestorDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const node = findDOMNode(this);
    const tree = {
      name: 'tree',
      children: this.props.items,
    };
    renderTree(node, tree);

    let resizeTimer;
    window.onresize = (() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderTree(node, tree);
      }, 250);
    });
  }

  render() {
    return (
      <div id="tree_map__container" />
    );
  }
}

export default AncestorDisplay;
