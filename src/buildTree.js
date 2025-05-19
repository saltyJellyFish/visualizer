// Builds binary tree from level-order array.
// Adds ._id property for node tracking.
export function buildTree(arr) {
  if (!arr.length || arr[0] == null) return null;
  let root = { val: arr[0], left: null, right: null, _id: 1 };
  let queue = [root];
  let i = 1, id = 2;
  while (i < arr.length) {
    let node = queue.shift();
    if (arr[i] != null) {
      node.left = { val: arr[i], left: null, right: null, _id: id++ };
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] != null) {
      node.right = { val: arr[i], left: null, right: null, _id: id++ };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}
