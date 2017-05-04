import React from 'react';
import PropTypes from 'prop-types';

import ScanList from './scan_list';

const Sidebar = ({ activeScan }) => (
  <div className="sidebar__container" >
    <div className="sidebar__tabs">
      <div>
        Scans
      </div>
    </div>
    <ScanList activeScan={activeScan} />
  </div>
);

Sidebar.defaultProps = {
  activeScan: undefined,
};

Sidebar.propTypes = {
  activeScan: PropTypes.string,
};

export default Sidebar;
