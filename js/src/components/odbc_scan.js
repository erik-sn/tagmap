import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { API } from '../actions/constants';
import { fetchDatabases, fetchScans, toggleScanOdbc } from '../actions';
import Database from './database';
import Loader from './loader';

class Odbc extends Component {

  constructor(props) {
    super(props);
    this.defaultState = {
      activeDatabase: undefined,
      deleteError: false,
      errors: undefined,
      scanning: false,
      success: undefined,
      httpRequest: undefined,
    };
    this.state = this.defaultState;
    this.handleDelete = this.handleDelete.bind(this);
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

  handleDelete() {
    const id = this.state.activeDatabase.id;
    axios.delete(`${API}/api/databases/${id}/`)
    .then((res) => {
      this.setState({
        activeDatabase: undefined,
      }, () => this.props.fetchDatabases());
    })
    .catch(() => {
      this.setState({
        deleteError: true,
      });
    });
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
    const { deleteError, scanning, activeDatabase } = this.state;
    const { databases } = this.props;
    return (
      <div className="odbc_scan__container" >
        <h2>Scan PI Database</h2>
        {scanning
          ? <Loader size={150} minHeight={200} />
          : <div className="odbc_scan__database-container">
            {databases.length === 0 ?
              <h4>There are no PI Databases configured</h4>
            : undefined}
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
        <div className="odbc_scan__error-container">
          {deleteError ? 'There was an error deleting this database' : ''}
        </div>
        <div className="odbc_scan__button-container button__container">
          {scanning ?
            <button
              className="uploader__button"
              onClick={this.cancelScan}
            >
              <img src={`${API}/static/api/cancel.svg`} alt="submit" />
              Cancel
            </button>
            : undefined}
          {activeDatabase && !scanning ?
            <button
              className="uploader__button"
              onClick={this.handleScan}
            >
              <img src={`${API}/static/api/scan.svg`} alt="submit" />
              Scan
            </button>
          : undefined}

          {activeDatabase && !scanning ?
            <button
              className="uploader__button"
              onClick={this.handleDelete}
            >
              <img src={`${API}/static/api/delete.svg`} alt="submit" />
              Delete
            </button>
          : undefined}
          {!scanning ?
            <button
              className="uploader__button"
              onClick={this.props.toggleScanOdbc}
            >
              <img src={`${API}/static/api/cancel.svg`} alt="submit" />
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
  };
}

export default connect(mapStateToProps, {
  fetchDatabases,
  fetchScans,
  toggleScanOdbc,
})(Odbc);
