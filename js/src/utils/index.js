

const tagRegex = /'(.*?)'/g;

/**
 * use the tagRegex to retrieve all quoted strings in
 * an input equation string. Return these strings in an
 * array
 *
 * @param {string} equation - PI ODBC equation
 * @returns string[] - list of children
 */
function parseEquationChildren(equation) {
  let matches = [];
  const output = [];
  // eslint-disable-next-line no-cond-assign
  while (matches = tagRegex.exec(equation)) {
    output.push(matches[1]);
  }
  return output;
}

/**
 * Return all "leaves" of a tag. Leaves are tags with no descendants
 *
 * @param {Tag[]} children - list of tags we are analyzing
 * @param {Tag[]} tags - all tags in the scan event group
 * @returns Tag[] tags with their descendants filled out
 */
function parseChildLeaves(children, tags) {
  return children.filter(childName => !tags.find(tag => tag.name === childName))
                 .map(leaf => ({ name: leaf, descendants: [] }));
}

/**
 * Find all direct descendants that have descendants of their own
 *
 * @param {Tag[]} children - list of tags we are analyzing
 * @param {Tag[]} tags - all tags in the scan event group
 * @param {string[]} ancestors - any ancestors that have been discovered so far
 * in this family tree
 * @returns Tag[] tags with their descendants filled out
 */
function parseChildBranches(children, tags, ancestors) {
  return children.map(childName => tags.find(tag => tag.name === childName))
                 .filter(tag => tag)
                  // eslint-disable-next-line no-use-before-define
                 .map(child => parseTagDescendants(child, tags, ancestors.concat(children)));
}

/**
 * recursively determine all children/descendants of the
 * input tag. Direct descendants are any tags that the input
 * uses in its equation.
 * @param {object} inputTag - tag being analyzed
 * @param {object[]} tags - list of all tags for the selected scan id
 * @param {string[]} [ancestors=[]] - list ancestor names - this is
 * recursively passed down the chain in order to avoid infinite loops
 * where a descendant may refer to an ancestor in their equation. Such
 * cases will cause the browser to crash
 * @returns copied inputTag with the descendants as an additional property
 */
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

/**
 * retrieve the first level ancestors (parents who use
 * the input tag) for the specified tag
 * @param {object} inputTag - tag being analyzed
 * @param {object[]} tags - list of all tags in the selected
 * scan event
 * @returns a copy of the input tag with the additional
 * ancestors property
 */
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

/**
 * retrieve the "influence" of a tag based on the amount of
 * ancestors it has and their children
 * @param {object[]} ancestors - list of tags that utilize
 * this tag in their equations
 * @returns ancestors - list of key/value pairs with the ancestor
 * and their size ("influence")
 */
export function parseInfluence(ancestors) {
  return ancestors.map((ancestor) => {
    const childCount = ancestor.children.length;
    return {
      name: ancestor.name,
      size: childCount < 1 ? 4 : childCount * 4,
    };
  });
}
