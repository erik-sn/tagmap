import React from 'react';

const Label = ({ label, value }) => (
  <div className="tag_detail__label">
    <h3>{label}:</h3>
    <span className="tag_detail__name">{value}</span>
  </div>
);

export default Label;
