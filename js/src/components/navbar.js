import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { API } from '../actions/constants';
import {
  toggleCreateOdbc as createOdbc,
  toggleScanOdbc as scanOdbc,
  toggleFileUploader as fileUploader,
} from '../actions';

/**
 * Top navbar with app icon & modal toggle options
 */
const Navbar = ({ toggleCreateOdbc, toggleScanOdbc, toggleFileUploader }) => (
  <nav className="navbar__container" >
    <img
      src={`${API}/static/api/icon.svg`}
      id="app__icon"
      alt="icon"
    />
    <div
      className="navbar__item"
      onClick={toggleCreateOdbc}
      role="button"
    >
      <img src={`${API}/static/api/add.svg`} alt="add odbc" />
      add odbc
    </div>
    <div
      className="navbar__item"
      onClick={toggleScanOdbc}
      role="button"
    >
      <img src={`${API}/static/api/scan.svg`} alt="scan odbc" />
      scan odbc
    </div>
    <div
      className="navbar__item"
      onClick={toggleFileUploader}
      role="button"
    >
      <img src={`${API}/static/api/upload.svg`} alt="scan file" />
      scan file
    </div>
  </nav>
);

Navbar.defaultProps = {
  toggleCreateOdbc: undefined,
  toggleScanOdbc: undefined,
  toggleFileUploader: undefined,
};

Navbar.propTypes = {
  toggleCreateOdbc: PropTypes.func,
  toggleScanOdbc: PropTypes.func,
  toggleFileUploader: PropTypes.func,
};

export default connect(null, {
  toggleCreateOdbc: createOdbc,
  toggleScanOdbc: scanOdbc,
  toggleFileUploader: fileUploader,
})(Navbar);
