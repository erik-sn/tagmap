import React, { Component } from 'react';
import { connect } from 'react-redux';
import FilterTable from 'filter-table';

import { fetchTags } from '../actions';
import Error from './error';
import Sidebar from './sidebar';
import Loader from './loader';

require('filter-table/dist/index.css');


const config = [
  { key: 'name', header: 'Name', width: '25%' },
  { key: 'exdesc', header: 'Equation', width: '75%' },
];


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

    const table = document.querySelector('.filter_table__body');
    if (table) {
      table.addEventListener('scroll', () => {

      });
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
      return <div>Select a Scan to Analyze</div>;
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

function mapStateToProps(state, ownProps) {
  const scanId = ownProps.match.params.scanId;
  return {
    tags: state.data.tags[scanId],
  };
}

export default connect(mapStateToProps, {
  fetchTags,
})(Taglist);
