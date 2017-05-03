import React from 'react';

import { API } from '../actions/constants';

const Loader = ({ size, minHeight }) => (
  <div className="loader__container" style={minHeight ? { minHeight } : undefined} >
    <img height={size} src={`${API}/static/api/gears.gif`} alt="loading" />
  </div>
);

export default Loader;

