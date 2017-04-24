import React, { Component } from 'react';
import { connect } from 'react-redux';

class TreeMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="tree_map__container" >
        <h3>Hello tree_map</h3>
      </div>
    );
  }
}

function mapStateToProps(state): {} {
  return {
  };
}

export default connect(mapStateToProps)(TreeMap);
