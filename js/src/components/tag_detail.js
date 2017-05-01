import React, { Component } from 'react';
import { connect } from 'react-redux';

import Ancestors from './ancestor_display';
import Influence from './influence_display';

const Label = ({ label, value }) => (
  <div className="tag_detail__label">
    <h3>{label}:</h3>
    <span className="tag_detail__name">{value}</span>
  </div>
);


const tagRegex = /'(.*?)'/g;

function parseEquationChildren(equation) {
  let matches = [];
  const output = [];
  while (matches = tagRegex.exec(equation)) {
    output.push(matches[1]);
  }
  return output;
}

function parseTagDescendants(inputTag, tags) {
  const updatedTag = Object.assign({}, inputTag);
  updatedTag.descendants = parseEquationChildren(inputTag.exdesc)
                        .map(childName => tags.find(tag => tag.name === childName))
                        .filter(tag => tag)
                        .map(child => this.parseTagDescendants(child));
  return updatedTag;
}

function parseTagAncestors(inputTag, tags) {
  const updatedTag = Object.assign({}, inputTag);
  const tagName = updatedTag.name.toLowerCase();
  updatedTag.ancestors = tags.filter((tag) => {
    return tag.exdesc.toLowerCase().indexOf(tagName) > -1;
  })
  .map((tag) => {
    const ancestorTag = Object.assign({}, tag);
    ancestorTag.children = parseEquationChildren(ancestorTag.exdesc);
    return ancestorTag;
  });
  return updatedTag;
}

function parseInfluence(ancestors) {
  return ancestors.map((ancestor) => {
    const childCount = ancestor.children.length;
    return {
      name: ancestor.name,
      size: childCount < 1 ? 4 : childCount * 4,
    };
  });
}

class TagDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  parseCousins() {
    return this.props.tag.ancestors.reduce((cousins, ancestor) => {
      return cousins.concat(ancestor.children);
    }, [])
    .reduce((cousins, cousin) => (
      cousins.indexOf(cousin) > -1 ? cousins : cousins.concat(cousin)
    ), []);
  }

  render() {
    if (this.props.notFound) {
      return <div>Not Found</div>;
    }
    if (!this.props.tag) {
      return <div>Loading...</div>;
    }
    const { name, exdesc, creation_date, creator, descendants,
      ancestors, change_date, changer, point_id } = this.props.tag;
    return (
      <div className="tag_detail__container" id="tagdetail" >
        <button id="tag_detail__back" onClick={this.props.reset}>Back</button>
        <h1>{name}</h1>
        <section className="tag_detail__labels">
          <Label label="Point ID" value={point_id} />
          <Label label="Created" value={creation_date} />
          <Label label="Creator" value={creator} />
          <Label label="Changed" value={change_date} />
          <Label label="Changer" value={changer} />
        </section>
        <section className="tag_detail__equation">
          <h3>Equation:</h3>
          {exdesc}
        </section>
        <section className="tag_detail__ancestor">
          {descendants.length > 0 ? <h3>Tag Descendants:</h3> : <h3>No Descendants Found</h3>}
          <div className="tag_detail__ancestor-chart">
            {descendants.length > 0
              ? <Ancestors tag={this.props.tag} />
              : undefined}
          </div>
        </section>
        <section className="tag_detail__parents">
          {ancestors.length > 0 ? <h3>Tag Ancestors:</h3> : <h3>No Ancestors Found</h3>}
          {ancestors.length > 0 ? <Influence items={this.parseInfluence()} /> : undefined}
        </section>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const tags = state.data.tags;
  const tag = tags.find(t => t.id === parseInt(ownProps.match.params.tagId, 10));
  if (!tag) {
    return {
      notFound: true,
    };
  }

  const tagWithDescendants = parseTagDescendants(tag, tags);
  const tagWithAncestors = parseTagAncestors(tagWithDescendants, tags);
  return {
    tag: tagWithAncestors,
    influence: parseInfluence(tagWithAncestors),
    notFound: false,
  };
}

export default connect(mapStateToProps)(TagDetail);
