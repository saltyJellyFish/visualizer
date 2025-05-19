import React from "react";

export default function TraversalControls({
  traversalType,
  setTraversalType,
  onStep,
  onSkip,
  isDisabled,
}) {
  const traversalOptions = [
    { value: "inorder", label: "Inorder" },
    { value: "preorder", label: "Preorder" },
    { value: "postorder", label: "Postorder" },
    { value: "levelorder", label: "Level-order" },
  ];

  return (
    <div>
      <select
        value={traversalType}
        onChange={(e) => setTraversalType(e.target.value)}
        disabled={isDisabled}
      >
        {traversalOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={onStep}
        disabled={isDisabled}
        type="button"
      >
        Step
      </button>
      <button
        onClick={onSkip}
        disabled={isDisabled}
        type="button"
      >
        Skip to Result
      </button>
    </div>
  );
}
