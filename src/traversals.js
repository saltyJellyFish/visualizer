// Returns array of node IDs in desired traversal order
export function inorder(root) {
  let res = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    res.push(node._id);
    dfs(node.right);
  }
  dfs(root);
  return res;
}

export function preorder(root) {
  let res = [];
  function dfs(node) {
    if (!node) return;
    res.push(node._id);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return res;
}

export function postorder(root) {
  let res = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    res.push(node._id);
  }
  dfs(root);
  return res;
}

export function levelorder(root) {
  let res = [];
  let queue = [];
  if (root) queue.push(root);
  while (queue.length) {
    let node = queue.shift();
    res.push(node._id);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return res;
}
