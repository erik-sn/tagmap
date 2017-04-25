import React, { Component } from 'react';
import { connect } from 'react-redux';

class Taglist extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="taglist__container" >
        <h3>Hello taglist</h3>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(Taglist);
