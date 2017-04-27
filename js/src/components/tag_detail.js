import React, { Component } from 'react';

import TreeDisplay from './tree_display';

class TagDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { name, exdesc, children } = this.props.tag;
    return (
      <div className="tag_detail__container" >
        <button id="tag_detail__back" onClick={this.props.reset}>Back</button>
        <h3>Name:</h3>
        <span className="tag_detail__name">{name}</span>
        <h4>Equations:</h4>
        <div className="tag_detail__equation">{exdesc}</div>
        <div className="tag_detail__tree">
          {children.length > 0 ? <TreeDisplay tag={this.props.tag} /> : undefined}
        </div>
      </div>
    );
  }
}

export default TagDetail;
