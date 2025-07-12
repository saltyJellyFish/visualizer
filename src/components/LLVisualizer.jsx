// src/components/LLVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Layout from './layout';

const ANIMATION_SPEED_MS = 400;

export default function LinkedListVisualizer({ initial = [], selectedType = 'Singly' }) {
  const [list, setList, undo, redo] = Layout.useHistory(initial);
  const [hovered, setHovered] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [error, setError] = useState('');
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
    setError('');
    setAnimationState({ running: false, currentIndex: null, targetValue: null, foundIndex: null, operation: null });
    const vals = inputValue.split(/[\s,]+/).filter(v => v);
    if (!vals.length) return setError('Enter one or more values.');
    
    const idx = (insertIndex === '') ? list.length : parseInt(insertIndex);
    if (isNaN(idx) || idx < 0 || idx > list.length) return setError('Invalid insertion index.');
    
    setList(currentList => [...currentList.slice(0, idx), ...vals, ...currentList.slice(idx)]);
    setInputValue('');
    setInsertIndex('');
  };

  const handleRemoveAt = () => {
    if (animationState.running) return;
    setAnimationState({ running: false, currentIndex: null, targetValue: null, foundIndex: null, operation: null });
    const idx = (insertIndex === '') ? list.length - 1 : parseInt(insertIndex);
    if (isNaN(idx) || idx < 0 || idx >= list.length) return setError('Invalid removal index.');
    
    const removeFn = (current) => [...current.slice(0, idx), ...current.slice(idx + 1)];
    const deleteAction = new Layout.Deletion({ setError, emptyMessage: 'List is empty.' });
    
    deleteAction(() => setList(removeFn), () => list, removeFn);
    setInsertIndex('');
  };

  const handleSearch = () => {
    if (animationState.running) return;
    setError('');
    const val = inputValue.trim();
    if (!val) return setError('Enter a value to search for.');
    animateTraversal(val);
  };
  
  const handleRandom = () => {
    if (animationState.running) return;
    setAnimationState({ running: false, currentIndex: null, targetValue: null, foundIndex: null, operation: null });
    setList(Layout.generateRandomStringArray());
  };

  const handleClear = () => {
    if (animationState.running) return;
    setError('');
    setAnimationState({ running: false, currentIndex: null, targetValue: null, foundIndex: null, operation: null });
    setList([]);
  };

  // --- Button Definitions ---
  const buttons = [
    { label: 'Insert', action: handleInsert, hoverText: 'Insert value(s) at specified index or end of list.' },
    { label: 'Remove At', action: handleRemoveAt, hoverText: 'Remove node at specified index or last node.' },
    { label: 'Search', action: handleSearch, hoverText: 'Search for a value in the list.'},
    { label: 'Random', action: handleRandom, hoverText: 'Generate a random list.' },
    { label: 'Clear', action: handleClear, hoverText: 'Clears all nodes from the list.' },
  ];

  const historyButtons = [
      { label: 'Undo', action: undo, hoverText: 'Undo the last action.' },
      { label: 'Redo', action: redo, hoverText: 'Redo the last undone action.' },
  ];
  
  // --- Dynamic Styling for Nodes ---
  const getNodeClass = (index) => {
    const { running, currentIndex, foundIndex, operation } = animationState;
    if (running && operation === 'search') {
      if (index === currentIndex) return 'node-visiting'; // Currently visiting
    }
    if (foundIndex === index) return 'node-found'; // Found
    return 'node'; // Default
  };

  // --- Pointer Component ---
  const Pointer = ({ fromIndex, toIndex, type, isCircular = false }) => {
    if (list.length === 0) return null;
    
    const nodeWidth = 80; // Approximate node width
    const nodeSpacing = 48; // Gap between nodes
    const totalNodeWidth = nodeWidth + nodeSpacing;
    
    let startX, startY, endX, endY, pathType;
    
    if (isCircular) {
      // Circular connection from last to first
      const containerWidth = list.length * totalNodeWidth;
      startX = (list.length - 1) * totalNodeWidth + nodeWidth / 2;
      startY = nodeWidth / 2;
      endX = nodeWidth / 2;
      endY = nodeWidth / 2;
      pathType = 'circular';
    } else {
      // Regular connection
      startX = fromIndex * totalNodeWidth + nodeWidth;
      startY = nodeWidth / 2;
      endX = toIndex * totalNodeWidth;
      endY = nodeWidth / 2;
      pathType = 'straight';
    }
    
    const createPath = () => {
      if (pathType === 'circular') {
        // Create curved path that goes below the nodes
        const midY = nodeWidth + 40;
        return `M ${startX} ${startY} 
                Q ${startX + 20} ${midY} ${(startX + endX) / 2} ${midY}
                Q ${endX - 20} ${midY} ${endX} ${endY}`;
      } else {
        // Straight line with slight curve for better visibility
        const controlY = startY - 10;
        return `M ${startX} ${startY} 
                Q ${(startX + endX) / 2} ${controlY} ${endX} ${endY}`;
      }
    };

    const getArrowColor = () => {
      switch (type) {
        case 'next': return '#2e495c';
        case 'prev': return '#577375';
        case 'circular': return '#e0586f';
        default: return '#2e495c';
      }
    };

    return (
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        <defs>
          <marker
            id={`arrowhead-${type}-${fromIndex}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill={getArrowColor()}
            />
          </marker>
        </defs>
        <path
          d={createPath()}
          stroke={getArrowColor()}
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#arrowhead-${type}-${fromIndex})`}
          opacity="0.8"
        />
      </svg>
    );
  };

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
          className="relative flex flex-wrap items-center justify-center gap-12 m-8 p-4 overflow-auto min-h-[160px]"
        >
          {/* Render Pointers */}
          {list.length > 0 && (
            <>
              {/* Forward pointers for all types */}
              {list.map((_, i) => {
                if (i < list.length - 1) {
                  return (
                    <Pointer
                      key={`next-${i}`}
                      fromIndex={i}
                      toIndex={i + 1}
                      type="next"
                    />
                  );
                }
                return null;
              })}
              
              {/* Backward pointers for doubly linked list */}
              {selectedType === 'Doubly' && list.map((_, i) => {
                if (i > 0) {
                  return (
                    <Pointer
                      key={`prev-${i}`}
                      fromIndex={i}
                      toIndex={i - 1}
                      type="prev"
                    />
                  );
                }
                return null;
              })}
              
              {/* Circular connection from tail to head */}
              {selectedType === 'Circular' && list.length > 1 && (
                <Pointer
                  key="circular"
                  fromIndex={list.length - 1}
                  toIndex={0}
                  type="circular"
                  isCircular={true}
                />
              )}
            </>
          )}
          
          {/* Render Nodes */}
          <AnimatePresence>
            {list.map((val, i) => (
              <motion.div
                key={`${val}-${i}`}
                layout
                className={`${getNodeClass(i)} relative z-10`}
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
              </motion.div>
            ))}
            
            {/* NULL terminator for non-circular lists */}
            {list.length > 0 && selectedType !== 'Circular' && (
               <motion.div
                layout
                className="node-null relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <span className="font-ancizar text-xl">NULL</span>
              </motion.div>
            )}
          </AnimatePresence>
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