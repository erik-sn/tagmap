import React, { Component } from 'react';

class TreeItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { tag } = this.props;
    return (
      <div className="tree_item__container" >
        <h5>{tag.name}</h5>
        <div className="tree_item__children">
          {tag.children.map(child => <TreeItem key={child.id} tag={child} />)}
        </div>
      </div>
    );
  }
}

export default TreeItem;
