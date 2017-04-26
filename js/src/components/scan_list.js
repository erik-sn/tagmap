import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { fetchScans, fetchTags } from '../actions';
import { API } from '../actions/constants';
import ScanItem from './scan_item';

class ScanList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeScanId: undefined,
      confirmDelete: false,
      deleteError: false,
    };
    this.handleSetActiveScan = this.handleSetActiveScan.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleStopDeleteProcess = this.handleStopDeleteProcess.bind(this);
  }

  componentWillMount() {
    const lastSeenScanId = JSON.parse(localStorage.getItem('activeScan'));
    if (lastSeenScanId) {
      this.handleSetActiveScan(lastSeenScanId);
    }
  }

  handleSetActiveScan(scanId) {
    localStorage.setItem('activeScan', JSON.stringify(scanId));
    this.setState({
      activeScanId: scanId,
      confirmDelete: false,
      deleteError: false,
    }, () => this.props.fetchTags(scanId));
  }

  handleStopDeleteProcess() {
    this.setState({ 
      confirmDelete: false,
    });
  }

  handleDelete() {
    const { activeScanId, confirmDelete } = this.state;
    if (!confirmDelete) {
      this.setState({
        confirmDelete: true,
        deleteError: false,
      });
    } else {
      axios.delete(`${API}/api/scans/${activeScanId}/`)
      .then(() => {
        this.setState({
          activeScanId: undefined,
          confirmDelete: false,
          deleteError: false,
        }, () => this.props.fetchScans());
      })
      .catch(() => {
        this.setState({
          deleteError: true,
          confirmDelete: false,
        });
      })
    }
  }

  render() {
    const { activeScanId, confirmDelete, deleteError } = this.state;
    const { scans } = this.props;
    return (
      <div className="scan_list__container" >
        <div className="scan_list__items">
          {scans.map(scan => (
            <ScanItem
              key={scan.id}
              scan={scan}
              handleClick={this.handleSetActiveScan}
              active={activeScanId && activeScanId === scan.id}
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
              <div>
                <button
                  className="uploader__button"
                  onClick={this.handleDelete}
                >
                  Confirm
                </button>
                <button
                  className="uploader__button"
                  onClick={this.handleStopDeleteProcess}
                >
                  Cancel
                </button>
              </div>
            </div>
            : undefined}
          {activeScanId && !confirmDelete ?
            <button
              className="uploader__button"
              onClick={this.handleDelete}
            >
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
})(ScanList);
