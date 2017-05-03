import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import { API } from '../actions/constants';
import { fetchScans, toggleFileUploader } from '../actions';

import Loader from './loader';

function handleFileButtonClick(event) {
  event.currentTarget.value = null; // eslint-disable-line no-param-reassign
}

/**
 * Modal component that handles uploading PI database
 * file scans to the API
 * @class Uploader
 * @extends {Component}
 */
class Uploader extends Component {

  constructor(props) {
    super(props);
    this.defaultState = {
      uploadedFile: undefined,
      error: undefined,
      invalid: undefined,
      count: undefined,
      uploading: false,
      httpRequest: undefined,
    };
    this.state = this.defaultState;

    this.handleDrop = this.handleDrop.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * set state back to default
   */
  resetState() {
    this.setState(this.defaultState);
  }

  /**
   * verify that the uploaded file has the correct file
   * extension
   * @param {File} uploadedFile - File object
   * @memberof Uploader
   */
  validateFile(uploadedFile) {
    const extension = uploadedFile.name.split('.').pop();
    if (extension === 'xlsx') {
      this.setState({ uploadedFile, error: '' });
    } else {
      this.setState({
        uploadedFile: undefined,
        error: 'Invalid file - xlsx file required',
      });
    }
  }

  /**
   * receive files from the uploader and use the first
   * in the list
   * @param {File[]} acceptedFiles - Array of file objects
   */
  handleDrop(acceptedFiles) {
    this.validateFile(acceptedFiles[0]);
  }

  /**
   * handle change on the file select input
   * @param {any} event - File select event
   */
  handleFileSelect(event) {
    event.preventDefault();
    this.validateFile(event.currentTarget.files[0]);
  }

  /**
   * if we have started a HTTP request through
   * axios cancel it - otherwise set state back
   * to default
   */
  handleCancel() {
    const { httpRequest } = this.state;
    if (httpRequest) {
      // case when we are actively uploading a file
      httpRequest.cancel();
      this.setState({ uploading: false, httpRequest: undefined });
    } else {
      // case when we just want to clear the form
      this.setState(this.defaultState);
    }
  }

  /**
   * submit the selected file to the API for submission
   */
  handleSubmit() {
    const data = new FormData();
    const file = this.state.uploadedFile;
    data.append('file', file);

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    this.setState({ uploading: true, invalid: undefined, count: undefined, httpRequest: source });
    axios.put(`${API}/api/upload/${file.name}/`, data, { cancelToken: source.token })
      .then((res) => {
        this.setState({
          error: '',
          invalid: res.data.invalid,
          count: res.data.count,
          uploading: false,
          httpRequest: undefined,
        }, () => this.props.fetchScans());
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        let error = '';
        const keys = Object.keys(err.response.data);
        error = err.response.data[keys[0]];
        this.setState({
          error,
          count: undefined,
          invalid: undefined,
          uploading: false,
          httpRequest: undefined,
        });
      });
  }

  /**
   * If a file is uploaded then return its name,
   * otherwise return a prompt
   */
  chooseMessage() {
    const { uploadedFile } = this.state;
    if (uploadedFile) {
      return uploadedFile.name;
    }
    return 'Drop tag xlsx file here';
  }

  render() {
    const { uploadedFile, error, count, invalid, uploading } = this.state;
    const dropClass = `uploader__dropzone${error ? ' dropzone__error' : ''}`;

    return (
      <div className="uploader__prompt">
        <Dropzone className={dropClass} onDrop={this.handleDrop}>
          {uploading ?
            <Loader size={125} /> :
            <div className="uploader__label">{this.chooseMessage()}</div>
          }
        </Dropzone>
        <div className="uploader__error">
          {error}
        </div>
        <div className="uploader__results">
          {count ? `Created scan with ${count} tags, ${invalid.length} were invalid` : ''}
        </div>
        <div className="uploader__buttons">
          {uploadedFile && !uploading ?
            <button
              className="uploader__button"
              onClick={this.handleSubmit}
            >
              <img src={`${API}/static/api/check.svg`} alt="submit" />
              Submit
            </button> : undefined}
          {!uploading && !uploadedFile ?
            <div className="inputWrapper uploader__button" style={{ width: '110px' }}>
              <img src={`${API}/static/api/upload.svg`} alt="upload file" />
              Choose File
              <input
                className="fileInput"
                name="tagfile"
                type="file"
                onClick={handleFileButtonClick}
                onChange={this.handleFileSelect}
              />
            </div>
            : undefined}
          {uploadedFile ?
            <button
              className="uploader__button"
              onClick={this.handleCancel}
            >
              <img src={`${API}/static/api/cancel.svg`} alt="cancel" />
              Cancel
            </button>
            : undefined}
          {!uploading && !uploadedFile ? <button
            className="uploader__button"
            onClick={this.props.toggleFileUploader}
          >
            <img src={`${API}/static/api/cancel.svg`} alt="close" />
            Close
          </button>
          : undefined}
        </div>
      </div>
    );
  }
}

Uploader.propTypes = {
  toggleFileUploader: PropTypes.func.isRequired,
  fetchScans: PropTypes.func.isRequired,
};

export default connect(null, {
  toggleFileUploader,
  fetchScans,
})(Uploader);
