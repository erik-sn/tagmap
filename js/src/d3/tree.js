/* eslint-disable no-confusing-arrow */
import d3 from 'd3';

function position() {
  this.style('left', d => `${d.x}px`)
      .style('top', d => `${d.y}px`)
      .style('width', d => `${Math.max(0, d.dx - 1)}px`)
      .style('height', d => `${Math.max(0, d.dy - 1)}px`);
}

function renderTreeMap(node, tree) {
  const width = window.innerWidth - 400;
  const height = 400;
  const color = d3.scale.category20c();
  const div = d3.select(node).append('div')
                .style('position', 'relative');

  const treemap = d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(d => d.size);

  div.datum(tree).selectAll('.node')
     .data(treemap.nodes)
     .enter()
     .append('div')
     .attr('class', 'tree_node')
     .call(position)
     .style('background-color', d => d.name === 'tree' ? '#fff' : color(d.name))
     .append('div')
     .style('font-size', d =>
       // compute font size based on sqrt(area)
        `${Math.max(20, 0.18 * Math.sqrt(d.area))}px`)
     .text(d => d.children ? null : d.name);
}

export default renderTreeMap;
