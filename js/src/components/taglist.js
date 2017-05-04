import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FilterTable from 'filter-table';

import { fetchTags as getTags } from '../actions';
import Error from './error';
import Sidebar from './sidebar';
import Loader from './loader';

// filter-table configuration
const config = [
  { key: 'name', header: 'Name', width: '25%' },
  { key: 'exdesc', header: 'Equation', width: '75%' },
];

/**
 * A sortable/filterable list of tags for whichever
 * scan event is selected
 * @class Taglist
 * @extends {Component}
 */
class Taglist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPrompt: false,
      tableHeight: undefined,
    };
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentWillMount() {
    const { fetchTags, match, tags } = this.props;
    if (match.params.scanId && !tags) {
      fetchTags(match.params.scanId);
    }
    this.getTableHeight();
    window.onresize = () => this.getTableHeight();
  }

  componentDidUpdate(prevProps) {
    const { fetchTags, match, tags } = this.props;
    const { scanId } = match.params;
    if (scanId && !tags && scanId !== prevProps.match.params.scanId) {
      fetchTags(match.params.scanId);
    }
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  getTags(scanId) {
    this.props.fetchTags(scanId);
  }

  getTableHeight() {
    let tableHeight = window.innerHeight - 170;
    if (tableHeight < 200) {
      tableHeight = 200;
    }
    this.setState({ tableHeight });
  }

  handleRowClick(rowData) {
    const { history, match } = this.props;
    history.push(`/${match.params.scanId}/${rowData.id}/`);
  }

  renderContainer() {
    const { match, tags } = this.props;
    if (!match.params.scanId) {
      return <h1>Select a Scan to Analyze</h1>;
    } else if (tags === 404) {
      return <Error message="Scan ID Not Found" />;
    } else if (match.params.scanId && !tags) {
      return <Loader size={150} minHeight={500} />;
    }
    return (
      <FilterTable
        tableData={tags}
        config={config}
        rowHeight={25}
        tableHeight={this.state.tableHeight}
        handleRowClick={this.handleRowClick}
        showFilter
        showCsv
        showResults
      />
    );
  }

  render() {
    const { match } = this.props;
    return (
      <div className="taglist__outer-container">
        <div className="taglist__container" id="taglist">
          {this.renderContainer()}
        </div>
        <Sidebar activeScan={match.params.scanId} />
      </div>
    );
  }
}

Taglist.defaultProps = {
  tags: undefined,
};

Taglist.propTypes = {
  fetchTags: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ scanId: PropTypes.string }),
  }).isRequired,
  tags: PropTypes.arrayOf(PropTypes.object),
};

function mapStateToProps(state, ownProps) {
  const scanId = ownProps.match.params.scanId;
  return {
    tags: state.data.tags[scanId],
  };
}

export default connect(mapStateToProps, {
  fetchTags: getTags,
})(Taglist);
