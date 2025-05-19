import React, { useState } from "react";
import TreeInput from "./components/TreeInput";
import TraversalControls from "./components/TraversalControls";
import TreeVisualizer from "./components/TreeVisualizer";
import { buildTree } from "./buildTree";
import { inorder, preorder, postorder, levelorder } from "./traversals";

const traversalFunctions = {
  inorder,
  preorder,
  postorder,
  levelorder,
};

function App() {
  const [arr, setArr] = useState([]);
  const [tree, setTree] = useState(null);
  const [traversalType, setTraversalType] = useState("inorder");
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [step, setStep] = useState(0);

  // Build tree on input
  const handleInput = (arr) => {
    setArr(arr);
    const t = buildTree(arr);
    setTree(t);
    setTraversalOrder([]);
    setStep(0);
  };

  // Recompute traversal order on type change
  React.useEffect(() => {
    if (tree) {
      const order = traversalFunctions[traversalType](tree);
      setTraversalOrder(order);
      setStep(0);
    }
  }, [tree, traversalType]);

  const handleStep = () => setStep((s) => Math.min(s + 1, traversalOrder.length));
  const handleSkip = () => setStep(traversalOrder.length);

  return (
    <div>
      <h1>Tree Traversal Visualizer</h1>
      <TreeInput onSubmit={handleInput} />
      <TraversalControls
        traversalType={traversalType}
        setTraversalType={setTraversalType}
        onStep={handleStep}
        onSkip={handleSkip}
        isDisabled={!tree}
      />
      <TreeVisualizer
        tree={tree}
        highlightIds={traversalOrder.slice(step - 1, step)}
        visitedIds={traversalOrder.slice(0, step - 1)}
      />
      <div>
        <strong>Traversal order:</strong>{" "}
        <span>
          {traversalOrder.slice(0, step).join(", ")}
        </span>
      </div>
    </div>
  );
}

export default App;
