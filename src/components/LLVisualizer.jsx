// src/components/LinkedListVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LinkedListTypes = ['Singly', 'Doubly', 'Circular'];

export default function LinkedListVisualizer({ initial = [] }) {
  const [list, setList] = useState(initial);
  const [type, setType] = useState('Singly');
  const [hovered, setHovered] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef();

  const handleInsert = () => {
    setError('');
    const vals = inputValue.split(/[\s,]+/).filter(v => v);
    if (!vals.length) return setError('Enter one or more values to insert.');
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

  const handleClear = () => {
    setError('');
    setList([]);
  };

  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      <div className="tanBox">
        <div className="nbar flex-wrap gap-4">
          {/* Type Selection Buttons */}
          {LinkedListTypes.map(llType => (
            <button
              key={llType}
              onClick={() => setType(llType)}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition ${
                type === llType ? 'bg-seaGreen bg-opacity-80 text-backgroundLighter' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {llType}
            </button>
          ))}

          {/* Input */}
          <div className="relative inline-block group">
            <input
              type="text"
              placeholder="Values"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="searchBoxPlaceholder"
            />
            <div className="bottonHover">
              Enter values (comma or space separated).
            </div>
          </div>

          {/* Insert Index */}
          <div className="relative inline-block group">
            <input
              type="number"
              placeholder="Insert at index (optional)"
              value={insertIndex}
              onChange={e => setInsertIndex(e.target.value)}
              className="searchBoxPlaceholder w-52"
            />
            <div className="bottonHover">
              Optional index to insert value(s).
            </div>
          </div>

          {/* Buttons */}
          <div className="relative inline-block group">
            <button onClick={handleInsert} className="bg-opacity-50 buttons">
              Insert
            </button>
            <div className="bottonHover">Insert value(s) at end or specific index.</div>
          </div>

          <div className="relative inline-block group">
            <button onClick={handleRemove} className="bg-opacity-70 buttons">
              Remove Head
            </button>
            <div className="bottonHover">Removes first node from list.</div>
          </div>

          <div className="relative inline-block group">
            <button onClick={handleClear} className="bg-opacity-85 buttons">
              Clear All
            </button>
            <div className="bottonHover">Clears all nodes from the list.</div>
          </div>
        </div>

        {/* Errors */}
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
                {type === 'Singly' && i < list.length - 1 && (
                  <span className="absolute -right-6 text-2xl font-bold text-darkBlue">→</span>
                )}
                {type === 'Doubly' && (
                  <span className="absolute -right-6 text-2xl font-bold text-darkBlue">⇄</span>
                )}
                {type === 'Circular' && (
                  <span className="absolute -right-6 text-2xl font-bold text-darkBlue">↻</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
