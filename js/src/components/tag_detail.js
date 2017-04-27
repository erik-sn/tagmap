import React, { Component } from 'react';

class TagDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { name, exdesc } = this.props.tag;
    return (
      <div className="tag_detail__container" >
        <button id="tag_detail__back" onClick={this.props.reset}>Back</button>
        <h3>Name:</h3>
        <span className="tag_detail__name">{name}</span>
        <h4>Equation:</h4>
        <div className="tag_detail__equation">{exdesc}</div>
      </div>
    );
  }
}

export default TagDetail;
