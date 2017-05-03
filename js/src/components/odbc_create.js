import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';

import { API } from '../actions/constants';
import { fetchDatabases, toggleCreateOdbc } from '../actions';
import Loader from './loader';

/**
 * Modal for creating an ODBC database configuration
 * @class Odbc
 * @extends {Component}
 */
class CreateOdbc extends Component {

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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * handle all input element value changes
   * @param {event} { currentTarget }
   */
  handleChange({ currentTarget }) {
    this.setState({ [currentTarget.name]: currentTarget.value });
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
          <Loader size={150} />
        </div>
      );
    }
    return (
      <div className="odbc__container" >
        <h2>Create PI ODBC Connection</h2>
        {submitting ? this.renderLoader() :
        <div className="odbc__input-container">
          <h4>Name</h4>
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <h4>Server</h4><span>IP address/Host that SQL subystem is installed on</span>
          <input
            type="text"
            name="server"
            value={this.state.server}
            onChange={this.handleChange}
          />
          <h4>Data Source</h4><span>IP address/Host of PI server</span>
          <input
            type="text"
            name="data_source"
            value={this.state.data_source}
            onChange={this.handleChange}
          />
          <h4>Description</h4>
          <input
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
          />
        </div>}
        <div className="odbc__error-container">
          {errors ? errors.map(error => <div className="odbc__error">{error}</div>) : undefined}
        </div>
        <div className="odbc__success-container">
          {success ? 'ODBC connection successfully created' : undefined}
        </div>
        <div className="odbc__button-container button__container">
          <button
            className="uploader__button"
            onClick={this.handleSubmit}
          >
            <img src={`${API}/static/api/check.svg`} alt="submit" />
            Submit
          </button>
          <button
            className="uploader__button"
            onClick={this.props.toggleCreateOdbc}
          >
            <img src={`${API}/static/api/cancel.svg`} alt="cancel" />
            Close
          </button>
        </div>
      </div>
    );
  }
}

CreateOdbc.defaultProps = {
  toggleCreateOdbc: undefined,
  fetchDatabases: undefined,
};

CreateOdbc.propTypes = {
  toggleCreateOdbc: PropTypes.func,
  fetchDatabases: PropTypes.func,
};

export default connect(null, {
  fetchDatabases,
  toggleCreateOdbc,
})(CreateOdbc);
