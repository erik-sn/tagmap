import React, { Component } from 'react';
import { connect } from 'react-redux';

import ScanItem from './scan_item';

class ScanList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeScan: undefined,
    };
    this.handleSetActiveScan = this.handleSetActiveScan.bind(this);
  }

  handleSetActiveScan(scan) {
    this.setState({ activeScan: scan });
  }

  render() {
    const { activeScan } = this.state;
    const { scans } = this.props;
    return (
      <div className="scan_list__container" >
        {scans.map((scan) => (
          <ScanItem
            key={scan.id}
            scan={scan}
            handleClick={this.handleSetActiveScan}
            active={activeScan && activeScan.id === scan.id}
          />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    scans: state.data.scans,
  };
}

export default connect(mapStateToProps)(ScanList);
