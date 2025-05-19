import React from "react";

// Helper to compute (x,y) positions for nodes
function getNodePositions(root, x = 250, y = 40, spread = 100, positions = [], depth = 0) {
  if (!root) return;
  positions.push({ id: root._id, val: root.val, x, y, depth });
  if (root.left)
    getNodePositions(root.left, x - spread, y + 70, spread / 1.6, positions, depth + 1);
  if (root.right)
    getNodePositions(root.right, x + spread, y + 70, spread / 1.6, positions, depth + 1);
  return positions;
}

function findNodeById(root, id) {
  if (!root) return null;
  if (root._id === id) return root;
  return findNodeById(root.left, id) || findNodeById(root.right, id);
}

export default function TreeVisualizer({ tree, highlightIds = [], visitedIds = [] }) {
  if (!tree) return <div className="text-gray-500 mb-6">Tree visualization will appear here.</div>;

  // Assign unique IDs for nodes (required for React and matching traversal order)
  let counter = 1;
  function assignIds(node) {
    if (!node) return;
    node._id = counter++;
    assignIds(node.left);
    assignIds(node.right);
  }
  assignIds(tree);

  // Compute positions
  const nodes = getNodePositions(tree) || [];

  // Render edges
  const edges = [];
  for (const node of nodes) {
    const curr = node;
    const left = nodes.find(n => n.id === (tree && findNodeById(tree, node.id).left?._id));
    const right = nodes.find(n => n.id === (tree && findNodeById(tree, node.id).right?._id));
    if (left) edges.push({ from: curr, to: left });
    if (right) edges.push({ from: curr, to: right });
  }

  return (
    <svg >
      {/* Draw edges */}
      {edges.map((edge, i) => (
        <line
          key={i}
          x1={edge.from.x}
          y1={edge.from.y}
          x2={edge.to.x}
          y2={edge.to.y}
          stroke="#888"
          strokeWidth="2"
        />
      ))}
      {/* Draw nodes */}
      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={22}
            fill={
              highlightIds.includes(node.id)
                ? "#f59e42" // orange highlight
                : visitedIds.includes(node.id)
                ? "#67e8f9" // cyan visited
                : "#fff"
            }
            stroke="#2563eb"
            strokeWidth="2"
          />
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fontSize="16"
            fill="#000"
            fontWeight="bold"
          >
            {node.val}
          </text>
        </g>
      ))}
    </svg>
  );
}
