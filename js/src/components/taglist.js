import React, { Component } from 'react';
import { connect } from 'react-redux';
import FilterTable from 'filter-table';

import Error from './error';
import TagDetail from './tag_detail';

require('filter-table/dist/index.css');


const config = [
  { key: 'name', header: 'Name', width: '25%' },
  { key: 'exdesc', header: 'Equation', width: '75%' },
];


const tagRegex = /'(.*?)'/g;

function parseEquationChildren(equation) {
  let matches = [];
  const output = [];
  while (matches = tagRegex.exec(equation)) {
    output.push(matches[1]);
  }
  return output;
}

class Taglist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableHeight: undefined,
      activeRow: undefined,
    };
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleRemoveActiveRow = this.handleRemoveActiveRow.bind(this);
  }

  componentWillMount() {
    this.getTableHeight();
    window.onresize = () => this.getTableHeight();
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  getTableHeight() {
    let tableHeight = window.innerHeight - 170;
    if (tableHeight < 200) {
      tableHeight = 200;
    }
    this.setState({ tableHeight });
  }

  handleRowClick(rowData, key) {
    this.setState({ activeRow: rowData });
  }

  handleRemoveActiveRow() {
    this.setState({ activeRow: undefined });
  }

  generateTagTree(inputTag) {
    const { tags } = this.props;
    const updatedTag = Object.assign({}, inputTag);
    updatedTag.children = parseEquationChildren(inputTag.exdesc)
                          .map(childName => tags.find(tag => tag.name === childName))
                          .filter(tag => tag)
                          .map(child => this.generateTagTree(child));
    return updatedTag;
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
      const tagWithTree = this.generateTagTree(activeRow, null);
      return (
        <div className="taglist__container">
          <TagDetail tag={tagWithTree} reset={this.handleRemoveActiveRow} />
        </div>
      );
    }

    return (
      <div className="taglist__container" id="taglist">
        <FilterTable
          tableData={tags}
          config={config}
          rowHeight={17}
          tableHeight={this.state.tableHeight}
          handleRowClick={this.handleRowClick}
          showFilter
          showCsv
          showResults
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
