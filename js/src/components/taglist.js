import React, { Component } from 'react';
import { connect } from 'react-redux';
import FilterTable from 'filter-table';

import Error from './error';

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
      activeRow: undefined,
    };
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentWillMount() {
    this.getTableHeight();
    window.onresize = () => this.getTableHeight();
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  getTableHeight() {
    let tableHeight = window.innerHeight - 135;
    if (tableHeight < 200) {
      tableHeight = 200;
    }
    this.setState({ tableHeight });
  }

  handleRowClick(rowData, key) {
    this.setState({ activeRow: rowData });
  }

  render() {
    const { activeRow } = this.state;
    const { tags, error } = this.props;
    if (error) {
      return (
        <div className="taglist__container" >
          <Error message={error} />
        </div>
      );
    }
    if (activeRow) {
      return (
        <div className="taglist__container">
          {activeRow.name}
        </div>
      );
    }

    return (
      <div className="taglist__container" >
        <FilterTable
          tableData={tags}
          config={config}
          rowHeight={17}
          tableHeight={this.state.tableHeight}
          handleRowClick={this.handleRowClick}
          showFilter
          showCsv
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tags: state.data.tags,
    error: state.data.error,
  };
}

export default connect(mapStateToProps)(Taglist);
