import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ message }) => (
  <div className="main__error-container">
    <h1>{message}</h1>
  </div>
);

Error.defaultProps = {
  message: 'Unknown Error',
};

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;

