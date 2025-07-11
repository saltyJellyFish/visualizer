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
    Layout.insertion({ inputValue, setError, setInputValue });
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
  const buttons = [
    { label: 'Insert', action: handleInsert, opacity: 'bg-opacity-70', hoverText: 'Insert value(s) at the end of the list.' },
    { label: 'Remove Head', action: handleRemove, opacity: 'bg-opacity-85', hoverText: 'Removes first node from list.' },
    { label: 'Clear', action: handleClear, opacity: 'bg-opacity-95', hoverText: 'Clears all nodes from the list.' },
  ];
  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      <div className="tanBox">
        <div className="nbar">
          {/*          {LinkedListTypes.map(llType => (
            <button
              key={llType}
              onClick={() => setType(llType)}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition ${
                type === llType ? 'bg-seaGreen bg-opacity-80 text-backgroundLighter' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {llType}
            </button>
          ))} */}
          <Layout.InputValue inputValue={inputValue} setInputValue={setInputValue} />
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
                {selectedType === 'Singly' && i < list.length - 1 && (
                  <span className="absolute -right-6 text-2xl font-bold text-darkBlue">→</span>
                )}
                {selectedType === 'Doubly' && (
                  <span className="absolute -right-6 text-2xl font-bold text-darkBlue">⇄</span>
                )}
                {selectedType === 'Circular' && (
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
