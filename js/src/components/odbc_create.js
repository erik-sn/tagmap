import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { API } from '../actions/constants';
import { fetchDatabases, toggleCreateOdbc } from '../actions';

class Odbc extends Component {

  constructor(props) {
    super(props);
    this.defaultState = {
      name: '',
      server: '',
      data_source: '',
      description: '',
      errors: undefined,
      success: undefined,
      submitting: false,
    };
    this.state = this.defaultState;
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ currentTarget }) {
    this.setState({ [currentTarget.name]: currentTarget.value });
  }

  handleCancel() {
    this.setState(this.defaultState);
  }

  handleSubmit() {
    this.setState({ submitting: true });
    axios.post(`${API}/api/databases/`, this.state)
    .then(() => {
      this.setState({
        ...this.defaultState,
        success: true,
      }, () => this.props.fetchDatabases());
    })
    .catch((err) => {
      const keys = Object.keys(err.response.data);
      const errors = keys.map(key => `${key}: ${err.response.data[key]}`);
      this.setState({
        errors,
        submitting: false,
        success: false,
      });
    });
  }

  render() {
    const { errors, success, submitting } = this.state;
    if (submitting) {
      return (
        <div className="odbc__container odbc__loading-container">
          <img height="150px" src={`${API}/static/api/gears.gif`} alt="loading" />
        </div>
      );
    }
    return (
      <div className="odbc__container" >
        <h2>Create PI ODBC Connection</h2>
        {submitting ? this.renderLoader() :
        <div className="odbc__input-container">
          <h4>Name</h4>
          <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
          <h4>Server</h4><span>IP address/Host that SQL subystem is installed on</span>
          <input type="text" name="server" value={this.state.server} onChange={this.handleChange} />
          <h4>Data Source</h4><span>IP address/Host of PI server</span>
          <input type="text" name="data_source" value={this.state.data_source} onChange={this.handleChange} />
          <h4>Description</h4>
          <input type="text" name="description" value={this.state.description} onChange={this.handleChange} />
        </div>}
        <div className="odbc__error-container">
          {errors ? errors.map(error => <div className="odbc__error">{error}</div>) : undefined}
        </div>
        <div className="odbc__success-container">
          {success ? 'ODBC connection successfully created' : undefined}
        </div>
        <div className="odbc__button-container">
          <button
            className="uploader__button"
            onClick={this.handleSubmit}
          >
            Submit
          </button>
          <button
            className="uploader__button"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
          <button
            className="uploader__button"
            onClick={this.props.toggleCreateOdbc}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default connect(null, {
  fetchDatabases,
  toggleCreateOdbc,
})(Odbc);
