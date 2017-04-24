import React, { Component } from 'react';
import { connect } from 'react-redux';

import { API } from '../actions/constants';
import { toggleOdbc, toggleFileUploader } from '../actions';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar__container" >
        <div
          className="navbar__item"
          onClick={this.props.toggleOdbc}
          role="button"
        >
          add odbc
        </div>
        <div
          className="navbar__item"
          onClick={this.props.toggleOdbc}
          role="button"
        >
          scan odbc
        </div>
        <div
          className="navbar__item"
          onClick={this.props.toggleFileUploader}
          role="button"
        >
          scan file
        </div>
        <div className="navbar__item">
          <a href="https://github.com/erik-sn/tagmap.git">
            <img height="35px" src={`${API}/static/api/github.png`} alt="Github" />
          </a>
        </div>
      </nav>
    );
  }
}

export default connect(null, { toggleOdbc, toggleFileUploader })(Navbar);
