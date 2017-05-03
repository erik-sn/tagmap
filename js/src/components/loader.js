import React from 'react';
import PropTypes from 'prop-types';

import { API } from '../actions/constants';

/**
 * Display a loading gif
 */
const Loader = ({ size, minHeight }) => (
  <div className="loader__container" style={minHeight ? { minHeight } : undefined} >
    <img height={size} src={`${API}/static/api/gears.gif`} alt="loading" />
  </div>
);

Loader.defaultProps = {
  size: 150,
  minHeight: undefined,
};

Loader.propTypes = {
  size: PropTypes.number,
  minHeight: PropTypes.number,
};

export default Loader;

