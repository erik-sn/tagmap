import React, { Component } from 'react';
import { connect } from 'react-redux';

import ScanList from './scan_list';
import TreeMap from './tree_map';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'scans',
    };
    this.showScanView = this.showScanView.bind(this);
    this.showTreeView = this.showTreeView.bind(this);
  }

  showScanView() {
    this.setState({ mode: 'scans' });
  }

  showTreeView() {
    this.setState({ mode: 'tree' });
  }

  render() {
    const { mode } = this.state;
    const { activeScan } = this.props;
    return (
      <div className="sidebar__container" >
        <div className="sidebar__tabs">
          <div
            className={`sidebar__tab${mode === 'scans' ? ' sidebar__active' : ''}`}
            role="button"
            onClick={this.showScanView}
          >
            Scans
          </div>
          <div
            className={`sidebar__tab${mode === 'tree' ? ' sidebar__active' : ''}`}
            role="button"
            onClick={this.showTreeView}
          >
            Tag Tree
          </div>
        </div>
        {mode === 'scans' ? <ScanList activeScan={activeScan} /> : <TreeMap />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tags: state.data.tags,
  };
}

export default connect(mapStateToProps)(Sidebar);
