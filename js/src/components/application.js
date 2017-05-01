import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import { fetchDatabases, fetchScans } from '../actions';
import Navbar from './navbar';
import OdbcCreate from './odbc_create';
import OdbcScan from './odbc_scan';
import Uploader from './uploader';
import TagList from './taglist';
import TagDetail from './tag_detail';


class Application extends Component {

  componentDidMount() {
    this.props.fetchScans();
    this.props.fetchDatabases();
  }

  render() {
    const { showCreateOdbc, showScanOdbc, showFileUploader, error } = this.props;
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
            <Switch>
              <Route exact path="/" component={TagList} />
              <Route exact path="/:scanId/" component={TagList} />
              <Route exact path="/:scanId/:tagId/" component={TagDetail} />
            </Switch >
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
    error: state.data.error,
  };
}

export default withRouter(connect(mapStateToProps, {
  fetchScans,
  fetchDatabases,
})(Application));
