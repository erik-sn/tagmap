import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchDatabases, fetchScans } from '../actions';
import Navbar from './navbar';

import OdbcCreate from './odbc_create';
import OdbcScan from './odbc_scan';
import Uploader from './uploader';
import Sidebar from './sidebar';

class Application extends Component {

  componentDidMount() {
    this.props.fetchScans();
    this.props.fetchDatabases();
  }

  render() {
    const { showCreateOdbc, showScanOdbc, showFileUploader } = this.props;
    let mainClass = 'application-container';
    if (showCreateOdbc || showScanOdbc || showFileUploader) {
      mainClass += ' application-modal';
    }
    return (
      <div>
        {showFileUploader ? <Uploader /> : undefined}
        {showCreateOdbc ? <OdbcCreate /> : undefined}
        {showScanOdbc ? <OdbcScan /> : undefined}
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
    showCreateOdbc: state.display.showCreateOdbc,
    showScanOdbc: state.display.showScanOdbc,
    showFileUploader: state.display.showFileUploader,
    scans: state.data.scans,
  };
}

export default connect(mapStateToProps, {
  fetchScans,
  fetchDatabases,
})(Application);
