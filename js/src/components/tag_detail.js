/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { API } from '../actions/constants';
import { fetchTags as getTags } from '../actions';
import { parseTagAncestors, parseTagDescendants,
  parseInfluence } from '../utils';
import Descendants from './descendant_display';
import Error from './error';
import Label from './tag_detail_label';
import Loader from './loader';

/**
 * Displays a specific tag object and all relevant
 * information related to it. This view also includes
 * a "family tree" of the child components.
 * @class TagDetail
 * @extends {Component}
 */
class TagDetail extends Component {

  componentWillMount() {
    const { tags, fetchTags, match } = this.props;
    if (!tags) {
      fetchTags(match.params.scanId);
    }
  }

  componentDidUpdate(prevProps) {
    const { fetchTags, match, tags } = this.props;
    if (!tags && match.params.scanId !== prevProps.match.params.scanId) {
      fetchTags(match.params.scanId);
    }
  }

  render() {
    const { notFound, tags, match } = this.props;
    if (tags === 404) {
      return <Error message="Scan ID Not Found" />;
    } else if (notFound) {
      return <Error message="Tag not found" />;
    } else if (match.params.scanId && !tags) {
      return <Loader size={150} minHeight={500} />;
    }
    const { name, exdesc, creation_date, creator, descendants,
      change_date, changer, point_id } = this.props.activeTag;
    return (
      <div className="tag_detail__container" id="tagdetail" >
        <Link to={`/${match.params.scanId}/`}>
          <button className="uploader__button" id="tag_detail__return" >
            <img src={`${API}/static/api/return.svg`} alt="return" />
            Back to Tag List
          </button>
        </Link>
        <section className="tag_detail__info">
          <div className="tag_detail__header">
            {name}
          </div>
          <div className="tag_detail__labels">
            <Label label="Point ID" value={point_id} />
            <Label label="Created" value={creation_date} />
            <Label label="Creator" value={creator} />
            <Label label="Changed" value={change_date} />
            <Label label="Changer" value={changer} />
          </div>
          <div className="tag_detail__equation">
            {exdesc}
          </div>
        </section>
        <section className="tag_detail__descendant">
          {descendants.length > 0 ? <h3>Tag Descendants:</h3> : <h3>No Descendants Found</h3>}
          <div className="tag_detail__descendant-chart">
            {descendants.length > 0
              ? <Descendants tag={this.props.activeTag} />
              : undefined}
          </div>
        </section>
      </div>
    );
  }
}

TagDetail.defaultProps = {
  activeTag: undefined,
  fetchTags: undefined,
  match: undefined,
  notFound: undefined,
  tags: [],
  tag: undefined,
};

TagDetail.propTypes = {
  activeTag: PropTypes.shape({
    name: PropTypes.string,
    exdesc: PropTypes.string,
    creation_date: PropTypes.string,
    creator: PropTypes.string,
    descendants: PropTypes.array,
    change_date: PropTypes.string,
    changer: PropTypes.string,
    point_id: PropTypes.number,
  }),
  notFound: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.object),
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  fetchTags: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const { scanId, tagId } = ownProps.match.params;
  const tags = state.data.tags[scanId];
  if (!tags) {
    return { tags: undefined, notFound: false };
  } else if (tags === 404) {
    return { tags };
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
  fetchTags: getTags,
})(TagDetail));
