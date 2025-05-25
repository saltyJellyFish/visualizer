// src/components/ArrayVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArrayVisualizer({ initial = [3,1,4,1,5,9] }) {
  const [arr, setArr] = useState(initial);
  const [highlighted, setHighlighted] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef();

  // clear highlight after pulse
  useEffect(() => {
    if (highlighted != null) {
      const t = setTimeout(() => setHighlighted(null), 1000);
      return () => clearTimeout(t);
    }
  }, [highlighted]);

  const validIndex = idx => !isNaN(idx) && idx >= 0 && idx < arr.length;
  const validInsertIndex = idx => !isNaN(idx) && idx >= 0 && idx <= arr.length;

  // Operations
  const handlePush = () => {
    setError('');
    if (inputValue === '') {
      setError('Invalid input. Enter a value to push.');
      return;
    }
    setArr(a => [...a, inputValue]);
    setInputValue('');
  };

  const handlePop = () => {
    setError('');
    if (arr.length === 0) {
      setError('Invalid input. Array is already empty.');
      return;
    }
    setArr(a => a.slice(0, -1));
  };

const handleInsertAt = () => {
  setError('');
  if (inputValue.trim() === '') {
    setError('Invalid input. Enter a value to insert.');
    return;
  }

  // If index field is empty, default to end of array
  const idx = inputIndex.trim() === ''
    ? arr.length
    : parseInt(inputIndex, 10);

  if (isNaN(idx) || idx < 0 || idx > arr.length) {
    setError(`Invalid input. Index must be between 0 and ${arr.length}.`);
    return;
  }
    setArr(a => {
      const c = [...a];
      c.splice(idx, 0, inputValue);
      return c;
    });
    setInputValue('');
  };

const handleDeleteAt = () => {
  setError('');
  if (arr.length === 0) {
    setError('Array is empty.');
    return;
  }
  const idx = inputIndex.trim() === ''
    ? arr.length - 1
    : parseInt(inputIndex, 10);
  if (isNaN(idx) || idx < 0 || idx >= arr.length) {
    setError(`Index must be between 0 and ${arr.length - 1}.`);
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
      setError(`Invalid input. Index must be 0–${arr.length - 1}.`);
      return;
    }
    setHighlighted(idx);
    containerRef.current.children[idx]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
    });
  };
  return (
    <div className="space-y-6 justify-items-center mb-40">
      {/* Toolbar */}
      <div className="flex flex-wrap bg-backgroundLighter bg-opacity-50 py-24 rounded-3xl place-content-evenly w-11/12 shadow-md shadow-stone-300 mb-12">

      <div className="flex flex-wrap bg-gray-700 bg-opacity-25 p-4 rounded-full shadow place-content-evenly w-10/12">
        <input
          type="text"
          placeholder="Value"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="px-5 py-2 my-1 rounded-full focus:outline-none text-lg "
        />
        <input
          type="number"
          placeholder="Index" color='pinkZ'
          value={inputIndex}
          onChange={e => setInputIndex(e.target.value)}
          className="px-5 py-2 my-1 rounded-full focus:outline-none text-lg"
        />

        {/* Action buttons */}
        {[
          { label: 'Insert', action: handleInsertAt, color: 'bg-seaGreen bg-opacity-50' },
          { label: 'Delete', action: handleDeleteAt, color: 'bg-seaGreen bg-opacity-60' },
          { label: 'Reset', action: handleReset,    color: 'bg-seaGreen bg-opacity-70' },
          { label: 'Highlight', action: handleHighlight, color: 'bg-seaGreen bg-opacity-80' },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.action } 
            className={`${btn.color} text-backgroundLighter px-16 py-2 my-1 rounded-full hover:opacity-90 transition hover:translate-x-1 hover:translate-y-1 hover:scale-110 text-lg`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Array display */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 pt-28 p-16"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <AnimatePresence initial={false}>
          {arr.map((v, i) => (
            <motion.div
              key={i}
              layout
              initial = {{ opacity: 0, x: 50 }}
              animate = {{ opacity: 1, x: 0 }}
              exit = {{ opacity: 0, x: -50 }}
              whileHover = {{ y: -5, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd  ={() => setHovered(null)}
              className = "relative flex-shrink-0 w-20 h-20 bg-backgroundLighter bg-opacity-40 border border-seaGreen border-opacity-35 rounded-full shadow-sm flex items-center justify-center "
              style={{ scrollSnapAlign: 'center' }}
            >
              <span className="font-ancizar text-xl">{v}</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: i === highlighted || i === hovered ? 1.4 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20}}
                className="absolute -top-2 -right-2 bg-pinkZ bg-opacity-60  text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {i}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </div>
         {error && (
     <div className="text-lg text-center border-pinkZ border-opacity-40 rounded-full px-5 border-4">
       {error}
     </div>
   )}
    </div>
  );
}
