
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

export function parseTagDescendants(inputTag, tags, ancestors = []) {
  const updatedTag = Object.assign({}, inputTag);
  // prevent infinite recursion by purging any tags that already
  // exist in the ancestors array
  const children = parseEquationChildren(updatedTag.exdesc)
                    .filter(childName => ancestors.indexOf(childName) === -1);

  const childBranches = parseChildBranches(children, tags, ancestors);
  const childLeaves = parseChildLeaves(children, tags);
  updatedTag.descendants = childLeaves.concat(childBranches);
  return updatedTag;
}

export function parseTagAncestors(inputTag, tags) {
  const updatedTag = Object.assign({}, inputTag);
  const tagName = updatedTag.name.toLowerCase();
  updatedTag.ancestors = tags.filter(tag => (
    tag.exdesc.toLowerCase().indexOf(tagName) > -1
  ))
  .map((tag) => {
    const ancestorTag = Object.assign({}, tag);
    ancestorTag.children = parseEquationChildren(ancestorTag.exdesc);
    return ancestorTag;
  });
  return updatedTag;
}

export function parseInfluence(ancestors) {
  return ancestors.map((ancestor) => {
    const childCount = ancestor.children.length;
    return {
      name: ancestor.name,
      size: childCount < 1 ? 4 : childCount * 4,
    };
  });
}
