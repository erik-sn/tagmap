import React from 'react';
import { connect } from 'react-redux';

import { fetchTags } from '../actions';

const ScanItem = ({ scan, active, handleClick, fetchTags }) => {
  const onClick = () => {
    fetchTags(scan.id);
    handleClick(scan);
  }
  const mainClass = `scan_item__container${active ? ' scan_item__active' : ''}`;
  return (
    <div
      className={mainClass}
      role="button"
      onClick={onClick}
    >
      <div className="scan_item__type">
        {scan.file_name ? 'Excel' : 'ODBC'}
      </div>
      <div className="scan_item__info">
        <div className="scan_item__name">
          {scan.file_name ? scan.file_name : scan.database.name}
        </div>
        <div className="scan_item__date">
          {`Tags: ${scan.tags} - ${scan.created}`}
        </div>
      </div>
    </div>
  );
}

export default connect(null, { fetchTags })(ScanItem);

