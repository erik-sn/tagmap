import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import renderTree from '../d3/tree';

/**
 * Render a Tree Map that shows all ancestors
 * of a tag as well as their "influence". Influence
 * is a rough calculation of how much they affect
 * the rest of their database
 * @class InfluenceDisplay
 * @extends {Component}
 */
class InfluenceDisplay extends Component {

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
    // let d3 handle dom manipulation
    return (
      <div id="tree_map__container" />
    );
  }
}

InfluenceDisplay.defaultProps = {
  items: undefined,
};

InfluenceDisplay.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
};

export default InfluenceDisplay;
