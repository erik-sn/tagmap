import d3 from 'd3';


function getTreeDepth(treeData) {
  let depth = 0;
  if (treeData.children) {
    treeData.children.forEach((d) => {
      const tempDepth = getTreeDepth(d);
      if (tempDepth > depth) {
        depth = tempDepth;
      }
    });
  }
  return 1 + depth;
}

export default function (svgDomNode, treeData) {

  const depth = getTreeDepth(treeData[0]);


  // ************** Generate the tree diagram	 *****************
  const root = treeData[0];
  const margin = { top: 20, right: 20, bottom: 20, left: root.name.length * 20 };
  const width = (depth * 350) - margin.right - margin.left;
  const height = 500 - margin.top - margin.bottom;

  let i = 0;
  const duration = 750;

  d3.select(svgDomNode).selectAll('*').remove();

  const tree = d3.layout.tree().size([height, depth * 350]);
  const diagonal = d3.svg.diagonal().projection(d => [d.y, d.x]);
  const svg = d3.select(svgDomNode).append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  root.x0 = height / 2;
  root.y0 = 0;

  update(root);

  d3.select(self.frameElement).style('height', '500px');

  function update(source) {
    // Compute the new tree layout.
    const nodes = tree.nodes(root).reverse();
    const links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach((d) => { d.y = d.depth * 180; });

    // Update the nodes…
    const node = svg.selectAll('g.node')
      .data(nodes, d => d.id || (d.id = ++i));

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${source.y0},${source.x0})`)
      .on('click', click);

    nodeEnter.append('circle')
      .attr('r', 1e-6);

    nodeEnter.append('text')
      .attr('x', d => d.children || d._children ? -13 : 13)
      .attr('dy', '.35em')
      .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
      .text(d => d.name)
      .style('fill-opacity', 1e-6);

    // Transition nodes to their new position.
    const nodeUpdate = node.transition()
      .duration(duration)
      .attr('transform', d => `translate(${d.y},${d.x})`);

    nodeUpdate.select('circle')
      .attr('r', 10)
      .style('fill', d => d._children ? '#0069C0' : '#fff')
      .style('opacity', d => d._children ? '0.9' : '1');

    nodeUpdate.select('text')
      .style('fill-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition()
      .duration(duration)
      .attr('transform', d => `translate(${source.y},${source.x})`)
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    // Update the links…
    const link = svg.selectAll('path.link')
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d) => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr('d', diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr('d', (d) => {
        const o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
}
