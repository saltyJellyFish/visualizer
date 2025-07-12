// src/components/ArrayVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Layout from '../components/layout';

// ADD: Allow options for array type (dynamic vs compact).
// Insert at specififc index doesn't work.
// Highlight doesn't work.
// Clear doesn't clear all.
export default function ArrayVisualizer({ initial = [3, 1, 4, 1, 5, 9] }) {
  const [arr, setArr] = useState(initial);
  const [highlighted, setHighlighted] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef(null); // Corrected ref initialization

  useEffect(() => {
    if (highlighted !== null) {
      const t = setTimeout(() => setHighlighted(null), 1000);
      return () => clearTimeout(t);
    }
  }, [highlighted]);

  const validIndex = (idx) => !isNaN(idx) && idx >= 0 && idx < arr.length;
  const validInsertIndex = (idx) => !isNaN(idx) && idx >= 0 && idx <= arr.length;

  const handleInsertAt = () => {
    setError('');
    if (inputValue.trim() === '') {
      setError('Invalid input. Enter a value to insert.');
      return;
    }
    const idx = inputIndex.trim() === '' ? arr.length : parseInt(inputIndex, 10);
    if (!validInsertIndex(idx)) {
      setError(`Invalid index. Must be between 0 and ${arr.length}.`);
      return;
    }
    setArr((a) => {
      const c = [...a];
      c.splice(idx, 0, inputValue);
      return c;
    });
    setInputValue('');
    setInputIndex('');
  };

  const handleDeleteAt = () => {
    setError('');
    if (arr.length === 0) {
      setError('Array is empty.');
      return;
    }
    const idx = inputIndex.trim() === '' ? arr.length - 1 : parseInt(inputIndex, 10);
    if (!validIndex(idx)) {
      setError(`Invalid index. Must be between 0 and ${arr.length - 1}.`);
      return;
    }
    setArr((a) => {
      const c = [...a];
      c.splice(idx, 1);
      return c;
    });
    setInputIndex('');
  };

  const handleReset = () => {
    setError('');
    setArr(initial);
    setInputValue('');
    setInputIndex('');
  };

  const handleHighlight = () => {
    setError('');
    const idx = parseInt(inputIndex, 10);
    if (!validIndex(idx)) {
      setError(`Invalid index. Must be between 0 and ${arr.length - 1}.`);
      return;
    }
    setHighlighted(idx);
    if (containerRef.current && containerRef.current.children[idx]) {
        containerRef.current.children[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const buttons = [
    { label: 'Insert', action: handleInsertAt, opacity: 'bg-opacity-60', hoverText: 'Insert value(s) at specified index.' },
    { label: 'Remove', action: handleDeleteAt, opacity: 'bg-opacity-70', hoverText: 'Deletes value(s) at the specified index.' },
    { label: 'Highlight', action: handleHighlight, opacity: 'bg-opacity-80', hoverText: 'Highlights the value at specified index.' },
    { label: 'Clear', action: handleReset, opacity: 'bg-opacity-90', hoverText: 'Clears all values from the list.' },
  ];

  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      <div className="tanBox">
        <div className="nbar">
          <div className="flex gap-4 w-full">
            {/* Corrected prop names from insertIndex to inputIndex */}
            <Layout.InputValue inputValue={inputValue} setInputValue={setInputValue} />
            <Layout.InputIndex inputIndex={inputIndex} setInputIndex={setInputIndex} />
          </div>
          <Layout.ButtonZ buttons={buttons} />
        </div>

        {error && (
          <div className="errorText">
            {error}
          </div>
        )}

        <div
          ref={containerRef}
          className="flex flex-wrap items-center gap-4 m-10 overflow-visible"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <AnimatePresence initial={false}>
            {arr.map((v, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                whileHover={{ y: -5, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="node"
                style={{ scrollSnapAlign: 'center' }}
              >
                <span className="font-ancizar">{v}</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: i === hovered || i === highlighted ? 1.4 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="nodeHover"
                >
                  {i}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}