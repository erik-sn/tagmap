import React from 'react';
import PropTypes from 'prop-types';

/**
 * A row in the ScanList component. Each item
 * represents a ScanEvent in the database
 */
const ScanItem = ({ scan, active, handleClick }) => {
  const onClick = () => handleClick(scan.id);
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
};

ScanItem.defaultProps = {
  scan: undefined,
  active: false,
  handleClick: undefined,
};

ScanItem.propTypes = {
  scan: PropTypes.shape({
    id: PropTypes.number,
    tags: PropTypes.number,
    file_name: PropTypes.string,
    created: PropTypes.string,
    database: PropTypes.object,
  }),
  active: PropTypes.bool,
  handleClick: PropTypes.func,
};

export default ScanItem;

