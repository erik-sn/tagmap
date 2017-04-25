import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { API } from '../actions/constants';
import { fetchScans, toggleScanOdbc } from '../actions';
import Database from './database';

class Odbc extends Component {

  constructor(props) {
    super(props);
    this.defaultState = {
      activeDatabase: undefined,
      errors: undefined,
      scanning: false,
      success: undefined,
      httpRequest: undefined,
    };
    this.state = this.defaultState;
    this.handleScan = this.handleScan.bind(this);
    this.cancelScan = this.cancelScan.bind(this);
    this.handleDatabaseClick = this.handleDatabaseClick.bind(this);
  }

  handleDatabaseClick(database) {
    this.setState({ activeDatabase: database });
  }

  cancelScan() {
    const httpRequest = this.state.httpRequest;
    if (httpRequest) {
      httpRequest.cancel();
      this.setState({
        scanning: false,
        errors: undefined,
        success: undefined,
        httpRequest: undefined,
      });
    }
  }

  handleScan() {
    const id = this.state.activeDatabase.id;
    
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    this.setState({ scanning: true, httpRequest: source });
    axios.get(`${API}/api/databases/${id}/`, { cancelToken: source.token })
    .then(() => {
      this.setState({
        ...this.defaultState,
        success: true,
      }, () => this.props.fetchScans());
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        return;
      }
      const keys = Object.keys(err.response.data);
      const errors = keys.map(key => `${key}: ${err.response.data[key]}`);
      this.setState({
        errors,
        scanning: false,
        success: false,
      });
    });
  }

  render() {
    const { errors, success, scanning, activeDatabase } = this.state;
    const { databases } = this.props;
    return (
      <div className="odbc_scan__container" >
        <h2>Scan PI Database</h2>
        {scanning
          ? <img height="150px" src={`${API}/static/api/gears.gif`} alt="loading" />
          : <div className="odbc_scan__database-container">
            {databases.map(db => (
              <Database
                key={db.id}
                database={db}
                handleClick={this.handleDatabaseClick}
                active={activeDatabase && activeDatabase.id === db.id}
              />
              ))}
          </div>
        }
        <div className="odbc_scan__button-container">
          {scanning ?
            <button
              className="uploader__button"
              onClick={this.cancelScan}
            >
              Cancel
            </button>
            : undefined}
          {activeDatabase && !scanning ?
            <button
              className="uploader__button"
              onClick={this.handleScan}
            >
              Scan
            </button>
          : undefined}
          {!scanning ?
            <button
              className="uploader__button"
              onClick={this.props.toggleScanOdbc}
            >
              Close
            </button>
          : undefined}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    databases: state.data.databases,
  }
}

export default connect(mapStateToProps, {
  fetchScans,
  toggleScanOdbc,
})(Odbc);
