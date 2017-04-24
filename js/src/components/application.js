import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchScans } from '../actions';
import Navbar from './navbar';

import Odbc from './odbc';
import Uploader from './uploader';
import Sidebar from './sidebar';

class Application extends Component {

  componentDidMount() {
    this.props.fetchScans();
  }

  render() {
    const { showOdbc, showFileUploader } = this.props;
    let mainClass = 'application-container';
    if (showOdbc || showFileUploader) {
      mainClass += ' application-modal';
    }
    return (
      <div>
        {showFileUploader ? <Uploader /> : undefined}
        {showOdbc ? <Odbc /> : undefined}
        <div className={mainClass}>
          <Navbar />
          <div className="main__container">
            <div className="tag__container">
              <h3>Tags</h3>
            </div>
            <Sidebar />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    showOdbc: state.display.showOdbc,
    showFileUploader: state.display.showFileUploader,
    scans: state.data.scans,
  };
}

export default connect(mapStateToProps, { fetchScans })(Application);
