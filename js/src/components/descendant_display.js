import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import renderDescendants from '../d3/descendants';

/**
 * format a tag and its descendants so they fit the expected
 * data structure the d3 family tree is expecting
 * @param {object} tag - tag object with descendants
 * @param {string} parentName - name of the tag's parent
 * @returns object
 */
function formatTagDescendants(tag, parentName) {
  return Object.assign({}, {
    name: tag.name,
    parent: parentName,
    children: tag.descendants.map(child => formatTagDescendants(child, tag.name)),
  });
}

/**
 * render a "family tree" where the root tag
 * is the first node and all of its descendants and
 * their descendants, etc. are displayed as branches
 * @class DescendantDisplay
 * @extends {Component}
 */
class DescendantDisplay extends Component {

  componentDidMount() {
    const node = findDOMNode(this);
    const cleanedTagHierarchy = formatTagDescendants(this.props.tag, null);
    renderDescendants(node, [cleanedTagHierarchy]);

    // similar to debounce - re-render d3 on resize
    // but only after the specified interval to prevent
    // excessive lag
    let resizeTimer;
    window.onresize = (() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderDescendants(node, [cleanedTagHierarchy]);
      }, 250);
    });
  }


  render() {
    // let d3 handle dom manipulation, just provide container
    return (
      <div id="ancestor__container" />
    );
  }
}

DescendantDisplay.defaultProps = {
  tag: undefined,
};

DescendantDisplay.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string,
    descendants: PropTypes.array,
  }),
};

export default DescendantDisplay;
