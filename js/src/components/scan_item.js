import React from 'react';
import { connect } from 'react-redux';

import { fetchTags } from '../actions';

const ScanItem = ({ scan, fetchTags }) => {
  const fetchScanTags = () => fetchTags(scan.id);
  return (
    <div
      className="scan_item__container"
      role="button"
      onClick={fetchScanTags}
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

