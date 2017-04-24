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
  }

  render() {
    const { mode } = this.state;
    return (
      <div className="sidebar__container" >
        <div className="sidebar__tabs">
          <div className="sidebar__tab">Scans</div>
          <div className="sidebar__tab">Tag Tree</div>
        </div>
        {mode === 'scans' ? <ScanList /> : <TreeMap />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(Sidebar);
