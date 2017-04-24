import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

import { API } from '../actions/constants';
import { toggleFileUploader } from '../actions';

class Uploader extends Component {

  defaultState = {
    uploadedFile: undefined,
    error: undefined,
    invalid: undefined,
    count: undefined,
    uploading: false,
    httpRequest: undefined,
  }

  constructor(props) {
    super(props);
    this.state = this.defaultState;

    this.handleDrop = this.handleDrop.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleFileButtonClick = this.handleFileButtonClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  resetState() {
    this.setState(this.defaultState);
  }

  validateFile(uploadedFile) {
    const extension = uploadedFile.name.split('.').pop();
    if (extension === 'xlsx') {
      this.setState({ uploadedFile, error: '' });
    } else {
      this.setState({
        uploadedFile: undefined,
        error: 'Invalid file - xlsx file required'
      });
    }
  }

  handleDrop(acceptedFiles) {
    this.validateFile(acceptedFiles[0]);
  }

  handleFileButtonClick(event) {
    event.currentTarget.value = null;
  }

  handleFileSelect(event) {
    event.preventDefault();
    this.validateFile(event.currentTarget.files[0]);
  }

  handleCancel() {
    const { httpRequest } = this.state;
    if (httpRequest) {
      // case when we are actively uploading a file
      httpRequest.cancel();
      this.setState({ uploading: false });
    } else {
      // case when we just want to clear the form
      this.setState(this.defaultState);
    }
  }

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
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        let error = '';
        for (let key in err.response.data) {
          error = err.response.data[key];
        }
        this.setState({
          error,
          count: undefined,
          invalid: undefined,
          uploading: false,
        });
      });
  }

  chooseMessage() {
    const { uploadedFile, error } = this.state;
    if (uploadedFile) {
      return uploadedFile.name;
    } else {
      return 'Drop tag xlsx file here';
    }
  }

  render() {
    const { uploadedFile, error, count, invalid, uploading } = this.state;
    const dropClass = `uploader__dropzone${error ? ' dropzone__error' : ''}`;

    let messageContainer = <div className="uploader__label">{this.chooseMessage()}</div>;
    if (uploading) {
      messageContainer = <img height="110px" src={`${API}/static/api/gears.gif`} alt="loading" />;
    }

    return (
      <div className="uploader__prompt">
        <Dropzone className={dropClass} onDrop={this.handleDrop}>
          {messageContainer}
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
              Submit
            </button> : undefined}
          {!uploading ? 
            <div className="inputWrapper uploader__button">
              Choose File
              <input
                className="fileInput"
                name="tagfile"
                type="file"
                onClick={this.handleFileButtonClick}
                onChange={this.handleFileSelect}
              />
            </div>
            : undefined}
          {uploadedFile ? 
            <button
              className="uploader__button"
              onClick={this.handleCancel}
            >
              Cancel
            </button>
            : undefined}
          <button
            className="uploader__button"
            onClick={this.props.toggleFileUploader}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default connect(null, { toggleFileUploader })(Uploader);
