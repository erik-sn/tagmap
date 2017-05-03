import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { fetchDatabases, fetchScans } from '../actions';
import Navbar from './navbar';
import OdbcCreate from './odbc_create';
import OdbcScan from './odbc_scan';
import Uploader from './uploader';
import TagList from './taglist';
import TagDetail from './tag_detail';


/**
 * Root application. Handles modals, navbar and
 * routing to child components
 * @class Application
 * @extends {Component}
 */
class Application extends Component {

  componentDidMount() {
    this.props.fetchScans();
    this.props.fetchDatabases();
  }

  render() {
    const { showCreateOdbc, showScanOdbc, showFileUploader } = this.props;
    let mainClass = 'application-container';
    // these are redux properties that indicate whether or not
    // a modal should be displayed
    if (showCreateOdbc || showScanOdbc || showFileUploader) {
      mainClass += ' application-modal';
    }
    return (
      <div>
        {/* modals */}
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

Application.defaultProps = {
  fetchScans: undefined,
  fetchDatabases: undefined,
  showCreateOdbc: false,
  showFileUploader: false,
  showScanOdbc: false,
};

Application.propTypes = {
  fetchScans: PropTypes.func,
  fetchDatabases: PropTypes.func,
  showCreateOdbc: PropTypes.bool,
  showFileUploader: PropTypes.bool,
  showScanOdbc: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    showCreateOdbc: state.display.showCreateOdbc,
    showScanOdbc: state.display.showScanOdbc,
    showFileUploader: state.display.showFileUploader,
  };
}

export default withRouter(connect(mapStateToProps, {
  fetchScans,
  fetchDatabases,
})(Application));
