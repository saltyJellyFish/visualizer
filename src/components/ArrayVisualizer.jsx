// src/components/ArrayVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArrayVisualizer({ initial = [3, 1, 4, 1, 5, 9] }) {
  const [arr, setArr] = useState(initial);
  const [highlighted, setHighlighted] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef();

  useEffect(() => {
    if (highlighted != null) {
      const t = setTimeout(() => setHighlighted(null), 1000);
      return () => clearTimeout(t);
    }
  }, [highlighted]);

  const validIndex = idx => !isNaN(idx) && idx >= 0 && idx < arr.length;
  const validInsertIndex = idx => !isNaN(idx) && idx >= 0 && idx <= arr.length;

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
    setArr(a => {
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
    setArr(a => {
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
    containerRef.current.children[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  };

  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      <div className="tanBox">
        <div className="nbar">

          <div className="relative inline-block group">
            <input
              type="text"
              placeholder="Value"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="searchBoxPlaceholder"
            />
            <div className="bottonHover">
              Enter values separated by commas or spaces.
            </div>
          </div>

          <div className="relative inline-block group">
            <input
              type="number"
              placeholder="Index"
              value={inputIndex}
              onChange={e => setInputIndex(e.target.value)}
              className="searchBoxPlaceholder"
            />
            <div className="bottonHover">
              Enter values separated by commas or spaces.
            </div>
          </div>

          {[{ label: 'Insert', action: handleInsertAt, color: 'bg-seaGreen bg-opacity-50' },
            { label: 'Delete', action: handleDeleteAt, color: 'bg-seaGreen bg-opacity-60' },
            { label: 'Reset', action: handleReset, color: 'bg-seaGreen bg-opacity-70' },
            { label: 'Highlight', action: handleHighlight, color: 'bg-seaGreen bg-opacity-80' }
          ].map(btn => (
            <div key={btn.label} className="relative inline-block group">
              <button
                onClick={btn.action}
                className={`${btn.color} buttons`}
              >
                {btn.label}
              </button>
              <div className="bottonHover">
                {btn.label === 'Insert' && 'Insert value at index (or end).'}
                {btn.label === 'Delete' && 'Delete value at index (or last).'}
                {btn.label === 'Reset' && 'Reset to initial values.'}
                {btn.label === 'Highlight' && 'Highlight value at index.'}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="errorText">
            {error}
          </div>
        )}

        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-4 p-8 pt-24"
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
                <span className="font-ancizar text-xl">{v}</span>
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
