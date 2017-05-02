import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { fetchScans, fetchTags, toggleCreateOdbc,
  toggleScanOdbc, toggleFileUploader } from '../actions';
import { API } from '../actions/constants';
import ScanItem from './scan_item';

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
    if (!this.props.activeScan) {
      const lastSeenScanId = JSON.parse(localStorage.getItem('activeScan'));
      if (lastSeenScanId) {
        this.handleSetActiveScan(lastSeenScanId);
      }
    }
  }

  handleSetActiveScan(scanId) {
    localStorage.setItem('activeScan', JSON.stringify(scanId));
    this.props.history.push(`/${scanId}/`);
  }

  handleStopDeleteProcess() {
    this.setState({
      confirmDelete: false,
    });
  }

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
