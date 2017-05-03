import React from 'react';
import PropTypes from 'prop-types';

const Label = ({ label, value }) => (
  <div className="tag_detail__label">
    <h3>{label}:</h3>
    <span className="tag_detail__name">{value}</span>
  </div>
);

Label.defaultProps = {
  label: undefined,
  value: undefined,
};

Label.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Label;
