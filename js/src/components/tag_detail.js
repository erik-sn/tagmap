import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { fetchTags } from '../actions';
import Descendants from './descendant_display';
import Influence from './influence_display';
import Error from './error';

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

function parseChildLeaves(children, tags) {
  return children.filter(childName => !tags.find(tag => tag.name === childName))
                 .map(leaf => ({ name: leaf, descendants: [] }));
}


function parseChildBranches(children, tags, ancestors) {
  return children.map(childName => tags.find(tag => tag.name === childName))
                 .filter(tag => tag)
                 .map(child => parseTagDescendants(child, tags, ancestors.concat(children)));
}

function parseTagDescendants(inputTag, tags, ancestors = []) {
  const updatedTag = Object.assign({}, inputTag);
  const children = parseEquationChildren(updatedTag.exdesc)
                    .filter(childName => ancestors.indexOf(childName) === -1);

  const childBranches = parseChildBranches(children, tags, ancestors);
  const childLeaves = parseChildLeaves(children, tags);
  updatedTag.descendants = childLeaves.concat(childBranches);
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

  componentWillMount() {
    const { tags, fetchTags, match } = this.props;
    if (!tags) {
      fetchTags(match.params.scanId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { fetchTags, match, tags } = this.props;
    if (!tags && match.params.scanId !== prevProps.match.params.scanId) {
      fetchTags(match.params.scanId);
    }
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
    const { notFound, tags, match } = this.props;
    if (tags === 404) {
      return <Error message="Scan ID Not Found" />;
    } else if (notFound) {
      return <Error message="Tag not found" />;
    } else if (match.params.scanId && !tags) {
      return <div>Loading...</div>;
    }
    const { name, exdesc, creation_date, creator, descendants,
      ancestors, change_date, changer, point_id } = this.props.activeTag;
    return (
      <div className="tag_detail__container" id="tagdetail" >
        <Link to={`/${match.params.scanId}/`}><button className="uploader__button">Back to Tag List</button></Link>
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
        <section className="tag_detail__descendant">
          {descendants.length > 0 ? <h3>Tag Descendants:</h3> : <h3>No Descendants Found</h3>}
          <div className="tag_detail__descendant-chart">
            {descendants.length > 0
              ? <Descendants tag={this.props.activeTag} />
              : undefined}
          </div>
        </section>
        <section className="tag_detail__ancestors">
          {ancestors.length > 0 ? <h3>Tag Ancestors:</h3> : <h3>No Ancestors Found</h3>}
          {ancestors.length > 0 ? <Influence items={this.props.influence} /> : undefined}
        </section>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { scanId, tagId } = ownProps.match.params;
  const tags = state.data.tags[scanId];
  if (!tags) {
    return { tags: undefined, notFound: false };
  } else if (tags === 404) {
    return { tags }
  }

  const tag = tags.find(t => t.id === parseInt(tagId, 10));
  if (!tag) {
    return { tags, notFound: true };
  }

  const tagWithDescendants = parseTagDescendants(tag, tags);
  const tagWithAncestors = parseTagAncestors(tagWithDescendants, tags);
  return {
    tags,
    activeTag: tagWithAncestors,
    influence: parseInfluence(tagWithAncestors.ancestors),
    notFound: false,
  };
}

export default withRouter(connect(mapStateToProps, {
  fetchTags,
})(TagDetail));
