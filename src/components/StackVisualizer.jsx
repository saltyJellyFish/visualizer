// src/components/StackVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StackVisualizer({ initial = [] }) {
  const [stack, setStack] = useState(initial);
  const [hovered, setHovered] = useState(null);
  const [highlighted, setHighlighted] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef();

  useEffect(() => {
    if (highlighted != null) {
      const t = setTimeout(() => setHighlighted(null), 1000);
      return () => clearTimeout(t);
    }
  }, [highlighted]);

  const handlePush = () => {
    setError('');
    if (!inputValue.trim()) {
      setError('Enter a value to push.');
      return;
    }
    setStack(s => [...s, inputValue]);
    setInputValue('');
  };

  const handlePop = () => {
    setError('');
    if (stack.length === 0) {
      setError('Stack is empty.');
      return;
    }
    setStack(s => s.slice(0, -1));
  };

  const handlePeek = () => {
    setError('');
    if (stack.length === 0) {
      setError('Stack is empty.');
      return;
    }
    setHighlighted(stack.length - 1);
  };

  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      {/* Toolbar */}
      <div className=" bg-backgroundLighterZ bg-opacity-20 py-24 rounded-3xl place-content-evenly w-11/12 shadow-md shadow-stone-300 my-12 justify-items-center">
      
        <div className="flex flex-wrap bg-gray-700 bg-opacity-25 p-4 rounded-full shadow place-content-evenly w-10/12">
            <input
            type="text"
            placeholder="Value"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="px-5 py-2 my-1 rounded-full focus:outline-none text-lg"
            />
            {[
            { label: 'Push',   action: handlePush,  color: 'bg-seaGreen bg-opacity-50' },
            { label: 'Pop',    action: handlePop,   color: 'bg-seaGreen bg-opacity-70' },
            { label: 'Peek',   action: handlePeek,  color: 'bg-seaGreen bg-opacity-90' },
            ].map(btn => (
            <button
                key={btn.label}
                onClick={btn.action}
                className={`${btn.color} text-backgroundLighter px-16 py-2 my-1 rounded-full hover:opacity-90 transition hover:translate-x-1 hover:translate-y-1 hover:scale-110 text-lg`}
            >
                {btn.label}
            </button>
            ))}
        </div>

      {/* Stack display (vertical) */}
     <div
        ref={containerRef}
        className="flex flex-col-reverse items-center gap-3 mt-8"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <AnimatePresence initial={false}>
          {stack.map((v, i) => (
            <motion.div
            key={i}
            layout
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            whileHover={{ y: -5, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            className="relative flex-shrink-0 w-20 h-20 bg-backgroundLighter bg-opacity-60 border border-seaGreen border-opacity-45 rounded-full shadow-sm flex items-center justify-center"
            style={{ scrollSnapAlign: 'center' }}
>
              <span className="font-ancizar text-lg">{v}</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: i === highlighted || i === hovered ? 1.4 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute -top-2 -right-2 bg-pinkZ bg-opacity-60 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
              >
                {i}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
            </div>
      {error && (
        <div className="text-lg text-center text-pinkZ border-pinkZ border-2 rounded-full px-5 py-2">
          {error}
        </div>
      )}
    </div>   );
}
