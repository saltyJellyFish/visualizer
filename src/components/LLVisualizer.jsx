import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Layout from "./layout";

// Arrow between nodes, or for Circular
function FlexArrow({ type }) {
  const stroke = "#1e3a5c";
  const strokeWidth = 1.5;
  const arrowSize = 8;
  const svgWidth = 90;
  const svgHeight = 48;

  if (type === "Doubly") {
    return (
      <svg height={svgHeight} width={svgWidth} style={{ minWidth: svgWidth, minHeight: svgHeight }}>
        <defs>
          <marker id="arrowhead" markerWidth={arrowSize} markerHeight={arrowSize}
            refX={arrowSize - 2} refY={arrowSize / 2} orient="auto">
            <polygon points={`0 0, ${arrowSize} ${arrowSize / 2}, 0 ${arrowSize}`} fill={stroke} />
          </marker>
        </defs>
        {/* Forward arrow: high arc */}
        <path
          d={`M16,20 Q${svgWidth/2},0 ${svgWidth-16},20`}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        {/* Backward arrow: low arc */}
        <path
          d={`M${svgWidth-16},28 Q${svgWidth/2},${svgHeight} 16,28`}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    );
  }

  return (
    <svg height={svgHeight} width={svgWidth} style={{ minWidth: svgWidth, minHeight: svgHeight }}>
      <defs>
        <marker id="arrowhead" markerWidth={arrowSize} markerHeight={arrowSize}
          refX={arrowSize - 2} refY={arrowSize / 2} orient="auto">
          <polygon points={`0 0, ${arrowSize} ${arrowSize / 2}, 0 ${arrowSize}`} fill={stroke} />
        </marker>
      </defs>
      <path
        d={`M16,24 Q${svgWidth/2},4 ${svgWidth-16},24`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}

// Circular: arrow from last node looping from below to the head node
function CircularLoopArrow({ nodeCount = 3 }) {
  // Adjust these values to match your node spacing & flex gap
  const nodeSpacing = 165; // Node diameter + gap (adjust to match your actual layout)
  const svgWidth = (nodeCount - 1) * nodeSpacing + 130; // Extra for arrowhead room
  const svgHeight = 110;

  const startX = svgWidth - 85; 
  const endX = 80; 
  const startY = 30;
  const endY = 30;
  const controlY = svgHeight; 

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{
        position: "absolute",
        left: 0,
        top: 80, 
        pointerEvents: "none",
        zIndex: 10,
        minWidth: svgWidth,
      }}
    >
      <defs>
        <marker id="arrowheadCircular" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, -1.5 8" fill="#1e3a5c" />
        </marker>
      </defs>
      <path
        d={`M${startX},${startY} Q${svgWidth / 2},${controlY} ${endX},${endY}`}
        stroke="#1e3a5c"
        strokeWidth={1.5}
        fill="none"
        markerEnd="url(#arrowheadCircular)"
      />
    </svg>
  );
}

export default function LLVisualizer({ initial = [], selectedType = "Singly" }) {
  const [list, setList, undo, redo] = Layout.useHistory(initial);
  const [hovered, setHovered] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [insertIndex, setInsertIndex] = useState("");
  const [error, setError] = useState("");
  const [animationState, setAnimationState] = useState({
    running: false,
    currentIndex: null,
    targetValue: null,
    foundIndex: null,
    operation: null,
  });
  const containerRef = useRef();

  // Reset visualizer when the list type or initial data changes
  useEffect(() => {
    setList(initial, true);
    setError('');
    setAnimationState({ running: false, currentIndex: null, targetValue: null, foundIndex: null, operation: null });
  }, [selectedType, initial]);

  // --- Animation Controller ---
  const animateTraversal = async (targetValue) => {
    setAnimationState({ running: true, currentIndex: null, targetValue, foundIndex: null, operation: 'search' });
    let found = -1;

    for (let i = 0; i < list.length; i++) {
      setAnimationState(prev => ({ ...prev, currentIndex: i }));
      await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED_MS));
      if (list[i] === targetValue) {
        found = i;
        break; // Stop traversal once found
      }
    }
    
    setAnimationState(prev => ({ ...prev, foundIndex: found, running: false }));
  };

  // --- Core Functions ---
  const handleInsert = () => {
    if (animationState.running) return;
    setError("");
    setAnimationState({ running: false, currentIndex: null, targetValue: null, foundIndex: null, operation: null });
    const vals = inputValue.split(/[\s,]+/).filter((v) => v);
    if (!vals.length) return setError("Enter one or more values.");
    const idx = insertIndex === "" ? list.length : parseInt(insertIndex);
    if (isNaN(idx) || idx < 0 || idx > list.length) return setError("Invalid insertion index.");
    setList((currentList) => [...currentList.slice(0, idx), ...vals, ...currentList.slice(idx)]);
    setInputValue("");
    setInsertIndex("");
  };

  const handleRemoveAt = () => {
    if (animationState.running) return;
    setAnimationState({ running: false, currentIndex: null, targetValue: null, foundIndex: null, operation: null });
    const idx = insertIndex === "" ? list.length - 1 : parseInt(insertIndex);
    if (isNaN(idx) || idx < 0 || idx >= list.length) return setError("Invalid removal index.");
    const removeFn = (current) => [...current.slice(0, idx), ...current.slice(idx + 1)];
    const deleteAction = new Layout.Deletion({ setError, emptyMessage: "List is empty." });
    deleteAction(() => setList(removeFn), () => list, removeFn);
    setInsertIndex("");
  };

  const handleSearch = () => {
    if (animationState.running) return;
    setError("");
    const val = inputValue.trim();
    if (!val) return setError("Enter a value to search for.");
    animateTraversal(val);
  };

  const animateTraversal = async (targetValue) => {
    setAnimationState({ running: true, currentIndex: null, targetValue, foundIndex: null, operation: "search" });
    let found = -1;
    for (let i = 0; i < list.length; i++) {
      setAnimationState((prev) => ({ ...prev, currentIndex: i }));
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (list[i] === targetValue) {
        found = i;
        break;
      }
    }
    setAnimationState((prev) => ({ ...prev, foundIndex: found, running: false }));
  };

  const handleRandom = () => {
    if (animationState.running) return;
    setAnimationState({ running: false, currentIndex: null, targetValue: null, foundIndex: null, operation: null });
    setList(Layout.generateRandomStringArray());
  };

  const handleClear = () => {
    if (animationState.running) return;
    setError("");
    setAnimationState({ running: false, currentIndex: null, targetValue: null, foundIndex: null, operation: null });
    setList([]);
  };

  const getNodeClass = (index) => {
    const { running, currentIndex, foundIndex, operation } = animationState;
    if (running && operation === "search") {
      if (index === currentIndex) return "node-visiting";
    }
    if (foundIndex === index) return "node-found";
    return "node";
  };

  const buttons = [
    { label: "Insert", action: handleInsert, hoverText: "Insert value(s) at specified index or end of list." },
    { label: "Remove At", action: handleRemoveAt, hoverText: "Remove node at specified index or last node." },
    { label: "Search", action: handleSearch, hoverText: "Search for a value in the list." },
    { label: "Random", action: handleRandom, hoverText: "Generate a random list." },
    { label: "Clear", action: handleClear, hoverText: "Clears all nodes from the list." }
  ];
  const historyButtons = [
    { label: "Undo", action: undo, hoverText: "Undo the last action." },
    { label: "Redo", action: redo, hoverText: "Redo the last undone action." }
  ];

  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      <div className="tanBox">
        <div className="nbar">
          <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
            <Layout.InputValue inputValue={inputValue} setInputValue={setInputValue} />
            <Layout.InputIndex insertIndex={insertIndex} setInsertIndex={setInsertIndex} />
          </div>
          <Layout.ButtonZ buttons={buttons} />
          <Layout.ButtonZ buttons={historyButtons} />
        </div>
        <div className="h-8 mt-2 text-center">
          {error && <div className="errorText">{error}</div>}
          {animationState.foundIndex === -1 && <div className="errorText">Value not found.</div>}
        </div>
        {/* --- List Visual --- */}
        <div
          ref={containerRef}
          className="flex flex-wrap items-center justify-center gap-12 m-8 p-4 overflow-auto min-h-[120px]"
        >
          <AnimatePresence>
            {list.map((val, i) => (
              <motion.div
                key={`${val}-${i}`}
                layout
                className={getNodeClass(i)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -5, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
              >
                <span className="font-ancizar text-xl">{val}</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: i === hovered ? 1.4 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="nodeHover"
                >
                  {i}
                </motion.span>
                {/* Connection indicators */}
                {i < list.length && selectedType === 'Singly' && (
                  <span className="absolute -right-8 text-2xl font-bold text-darkBlue">→</span>
                )}
                 {i < list.length -1 && selectedType === 'Circular' && (
                  <span className="absolute -right-8 text-2xl font-bold text-darkBlue">→</span>
                )}
                {selectedType === 'Doubly' && i > 0 && (
                  <span className="absolute -left-8 text-2xl font-bold text-darkBlue">⇄</span>
                )}
                {/* Circular connection from last to first */}
                {selectedType === 'Circular' && i === list.length - 1 && list.length > 0 && (
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-darkBlue">↻</span>
                )}
              </motion.div>
            ))}
            
            {list.length > 0 && selectedType !== 'Circular' && (
               <motion.div
                layout
                className="node-null"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <span className="font-ancizar text-xl">NULL</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Circular connection from tail to head */}
          {selectedType === 'Circular' && list.length > 1 && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
              <svg width="200" height="40" className="overflow-visible">
                <defs>
                  <marker
                    id="circular-arrow"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 8 3, 0 6"
                      fill="#e0586f"
                    />
                  </marker>
                </defs>
                <path
                  d="M 20 20 Q 100 35 180 20"
                  stroke="#e0586f"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#circular-arrow)"
                />
              </svg>
              <div className="text-center text-sm text-pink mt-1">tail → head</div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center mt-4 space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-darkBlue"></div>
            <span>Next pointer</span>
          </div>
          {selectedType === 'Doubly' && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-seaGreen"></div>
              <span>Previous pointer</span>
            </div>
          )}
          {selectedType === 'Circular' && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-pink"></div>
              <span>Circular pointer</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}