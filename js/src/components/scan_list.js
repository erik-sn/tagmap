import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import { fetchScans, fetchTags, toggleCreateOdbc,
  toggleScanOdbc, toggleFileUploader } from '../actions';
import { API } from '../actions/constants';
import ScanItem from './scan_item';

/**
 * Component that handles displaying and operating
 * on ScanEvent objects
 * @class ScanList
 * @extends {Component}
 */
class ScanList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
      deleteError: false,
    };
    this.handleSetActiveScan = this.handleSetActiveScan.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleStopDeleteProcess = this.handleStopDeleteProcess.bind(this);
  }

  componentWillMount() {
    // if no activeScan is set on moutn check local storage
    // and open the user's previously opened scan and set
    // it as active
    if (!this.props.activeScan) {
      const lastSeenScanId = JSON.parse(localStorage.getItem('activeScan'));
      if (lastSeenScanId) {
        this.handleSetActiveScan(lastSeenScanId);
      }
    }
  }

  /**
   * given a scan ID set it as active and update the
   * browser URL to navigate to it
   * @param {number} scanId - id/pk of the selected scan event
   */
  handleSetActiveScan(scanId) {
    localStorage.setItem('activeScan', JSON.stringify(scanId));
    this.props.history.push(`/${scanId}/`);
  }

  /**
   * stop the workflow for deleting a ScanEvent
   */
  handleStopDeleteProcess() {
    this.setState({ confirmDelete: false });
  }

  /**
   * delete the selected ScanEvent
   * @memberof ScanList
   */
  handleDelete() {
    const { activeScan } = this.props;
    const { confirmDelete } = this.state;
    if (!confirmDelete) {
      this.setState({
        confirmDelete: true,
        deleteError: false,
      });
    } else {
      axios.delete(`${API}/api/scans/${activeScan}/`)
      .then(() => {
        this.setState({
          confirmDelete: false,
          deleteError: false,
        }, () => this.props.fetchScans());
      })
      .catch(() => {
        this.setState({
          deleteError: true,
          confirmDelete: false,
        });
      });
    }
  }

  render() {
    const { confirmDelete, deleteError } = this.state;
    const { activeScan, scans } = this.props;
    return (
      <div className="scan_list__container" >
        <div className="scan_list__items">
          {scans.map(scan => (
            <ScanItem
              key={scan.id}
              scan={scan}
              handleClick={this.handleSetActiveScan}
              active={parseInt(activeScan, 10) === scan.id}
            />
          ))}
        </div>
        <div className="scan_list__error-container">
          {deleteError ? 'There was an error deleting this scan event' : ''}
        </div>
        <div className="scan_list__buttons">
          {confirmDelete ?
            <div>
              <div className="scan_list__confirm">
                Are you sure you want to delete this scan?
              </div>
              <div className="button__container" >
                <button
                  className="uploader__button"
                  onClick={this.handleDelete}
                >
                  <img src={`${API}/static/api/check.svg`} alt="confirm" />
                  Confirm
                </button>
                <button
                  className="uploader__button"
                  onClick={this.handleStopDeleteProcess}
                >
                  <img src={`${API}/static/api/cancel.svg`} alt="cancel" />
                  Cancel
                </button>
              </div>
            </div>
            : undefined}
          {activeScan && !confirmDelete ?
            <button
              className="uploader__button"
              onClick={this.handleDelete}
            >
              <img src={`${API}/static/api/delete.svg`} alt="confirm" />
              Delete
            </button>
            : undefined}
        </div>
      </div>
    );
  }
}

ScanList.defaultProps = {
  activeScan: undefined,
  scans: [],
  fetchScans: undefined,
  history: undefined,
};

ScanList.propTypes = {
  activeScan: PropTypes.string,
  scans: PropTypes.arrayOf(PropTypes.object),
  fetchScans: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

function mapStateToProps(state) {
  return {
    scans: state.data.scans,
  };
}

export default connect(mapStateToProps, {
  fetchScans,
  fetchTags,
  toggleCreateOdbc,
  toggleScanOdbc,
  toggleFileUploader,
})(withRouter(ScanList));
