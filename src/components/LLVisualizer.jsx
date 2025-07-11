// src/components/LinkedListVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Layout from '../components/layout';

export default function LinkedListVisualizer({ initial = [], selectedType = 'Singly' }) {
  const [list, setList] = useState(initial);
  const [hovered, setHovered] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef();
  useEffect(() => { setList(initial); }, [selectedType]);


  const handleInsert = () => {
    setError('');
    const vals = inputValue.split(/[\s,]+/).filter(v => v);
    if (!vals.length) {
      setError('Enter one or more values.');
      return;
    }
    if (insertIndex === '') {
      setList([...list, ...vals]);
    } else {
      const idx = parseInt(insertIndex);
      if (isNaN(idx) || idx < 0 || idx > list.length) {
        return setError('Invalid insertion index.');
      }
      const newList = [...list.slice(0, idx), ...vals, ...list.slice(idx)];
      setList(newList);
    }
    setInputValue('');
    setInsertIndex('');
  };

  const handleRemove = () => {
    setError('');
    if (!list.length) return setError('Linked List is empty.');
    setList(list.slice(1));
  };

  const handleRemoveAt = () => {
    setError('');
    if (!list.length) return setError('Linked List is empty.');
    
    if (insertIndex === '') {
      // Remove last element if no index specified
      setList(list.slice(0, -1));
    } else {
      const idx = parseInt(insertIndex);
      if (isNaN(idx) || idx < 0 || idx >= list.length) {
        return setError('Invalid removal index.');
      }
      const newList = [...list.slice(0, idx), ...list.slice(idx + 1)];
      setList(newList);
    }
    setInsertIndex('');
  };

  const handleClear = () => {
    setError('');
    setList([]);
  };

  const buttons = [
    { label: 'Insert', action: handleInsert, opacity: 'bg-opacity-60', hoverText: 'Insert value(s) at specified index or end of list.' },
    { label: 'Remove Head', action: handleRemove, opacity: 'bg-opacity-70', hoverText: 'Removes first node from list.' },
    { label: 'Remove At', action: handleRemoveAt, opacity: 'bg-opacity-80', hoverText: 'Remove node at specified index or last node.' },
    { label: 'Clear', action: handleClear, opacity: 'bg-opacity-90', hoverText: 'Clears all nodes from the list.' },
  ];

  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      <div className="tanBox">
        <div className="nbar">
          <Layout.InputValue inputValue={inputValue} setInputValue={setInputValue} />
          <div className="relative inline-block group">
            <input
              type="number"
              placeholder="Index (optional)"
              value={insertIndex}
              onChange={e => setInsertIndex(e.target.value)}
              className="searchBoxPlaceholder"
            />
            <div className="buttonHover">
              Specify index for insertion/removal (leave empty for end/last).
            </div>
          </div>
          <Layout.ButtonZ buttons={buttons} />
        </div>
        {error && <div className="errorText">{error}</div>}
        {/* List Visual */}
        <div
          ref={containerRef}
          className="flex flex-wrap items-center gap-8 m-8 p-4 overflow-auto"
        >
          <AnimatePresence initial={false}>
            {list.map((val, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -5, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="node"
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
                {i < list.length - 1 && (
                  <>
                    {selectedType === 'Singly' && (
                      <span className="absolute -right-6 text-2xl font-bold text-darkBlue">→</span>
                    )}
                    {selectedType === 'Doubly' && (
                      <span className="absolute -right-6 text-2xl font-bold text-darkBlue">⇄</span>
                    )}
                    {selectedType === 'Circular' && (
                      <span className="absolute -right-6 text-2xl font-bold text-darkBlue">→</span>
                    )}
                  </>
                )}
                {/* Circular connection from last to first */}
                {selectedType === 'Circular' && i === list.length - 1 && list.length > 1 && (
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-darkBlue">↻</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
