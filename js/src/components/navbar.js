import React, { Component } from 'react';
import { connect } from 'react-redux';

import { API } from '../actions/constants';
import { toggleCreateOdbc, toggleScanOdbc,
  toggleFileUploader } from '../actions';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar__container" >
        <img
          src={`${API}/static/api/icon.svg`}
          id="app__icon"
          alt="icon"
        />
        <div
          className="navbar__item"
          onClick={this.props.toggleCreateOdbc}
          role="button"
        >
          <img src={`${API}/static/api/add.svg`} alt="add odbc" />
          add odbc
        </div>
        <div
          className="navbar__item"
          onClick={this.props.toggleScanOdbc}
          role="button"
        >
          <img src={`${API}/static/api/scan.svg`} alt="scan odbc" />
          scan odbc
        </div>
        <div
          className="navbar__item"
          onClick={this.props.toggleFileUploader}
          role="button"
        >
          <img src={`${API}/static/api/upload.svg`} alt="scan file" />
          scan file
        </div>
        {/*<div className="navbar__item">
          <a href="https://github.com/erik-sn/tagmap.git">
            <img height="35px" src={`${API}/static/api/github.png`} alt="Github" />
          </a>
        </div>*/}
      </nav>
    );
  }
}

export default connect(null, {
  toggleCreateOdbc,
  toggleScanOdbc,
  toggleFileUploader,
})(Navbar);
