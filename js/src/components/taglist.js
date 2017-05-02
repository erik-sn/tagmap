import React, { Component } from 'react';
import { connect } from 'react-redux';
import FilterTable from 'filter-table';

import { fetchTags } from '../actions';
import Error from './error';
import Sidebar from './sidebar';

require('filter-table/dist/index.css');


const config = [
  { key: 'name', header: 'Name', width: '25%' },
  { key: 'exdesc', header: 'Equation', width: '75%' },
];


class Taglist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableHeight: undefined,
    };
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentWillMount() {
    const { fetchTags, match, tags } = this.props;
    if (!tags) {
      fetchTags(match.params.scanId);
    }
    this.getTableHeight();
    window.onresize = () => this.getTableHeight();

  }

  componentDidUpdate(prevProps, prevState) {
    const { fetchTags, match, tags } = this.props;
    if (!tags && match.params.scanId !== prevProps.match.params.scanId) {
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

  render() {
    const { tags, error } = this.props;
    if (!tags) {
      return <div>Loading...</div>;
    }
    if (error) {
      return (
        <div className="taglist__container" id="taglist" >
          <Error message={error} />
        </div>
      );
    }
    return (
      <div className="taglist__outer-container">
        <div className="taglist__container" id="taglist">
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
        </div>
        <Sidebar activeScan={this.props.match.params.scanId} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const scanId = ownProps.match.params.scanId;
  return {
    tags: state.data.tags[scanId],
    error: state.data.error,
  };
}

export default connect(mapStateToProps, {
  fetchTags,
})(Taglist);
