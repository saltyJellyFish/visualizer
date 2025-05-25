// src/components/QueueVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QueueVisualizer({ initial = [] }) {
  const [queue, setQueue] = useState(initial);
  const [hovered, setHovered] = useState(null);
  const [peekValue, setPeekValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef();

  // clear peek display after 5s
  useEffect(() => {
    if (peekValue != null) {
      const t = setTimeout(() => setPeekValue(null), 5000);
      return () => clearTimeout(t);
    }
  }, [peekValue]);

  const handleEnqueue = () => {
    setError('');
    const vals = inputValue.split(/[\s,]+/).filter(v => v);
    if (!vals.length) {
      setError('Enter one or more values to enqueue.');
      return;
    }
    setQueue(q => [...q, ...vals]);
    setInputValue('');
  };

  const handleDequeue = () => {
    setError('');
    if (queue.length === 0) {
      setError('Queue is empty.');
      return;
    }
    setQueue(q => q.slice(1));
  };

  const handlePeek = () => {
    setError('');
    if (queue.length === 0) {
      setError('Queue is empty.');
      return;
    }
    setPeekValue(queue[0]);
  };

  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      {/* Toolbar */}
      <div className="bg-backgroundLighterZ bg-opacity-30 py-24 rounded-3xl place-content-evenly w-11/12 shadow-md shadow-stone-300 my-12 justify-items-center">
        <div className="flex flex-wrap bg-gray-700 bg-opacity-30 p-4 rounded-full shadow place-content-evenly w-10/12">
          
          {/* Input with tooltip */}
          <div className="relative inline-block group">
            <input
              type="text"
              placeholder="Values"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="px-5 py-2 my-1 rounded-full focus:outline-none text-lg"
            />
            <div
              className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-5 w-max bg-darkBlue text-white text-base font-medium rounded-full py-1 px-3 opacity-0 group-hover:opacity-90 transition-opacity"
            >
              Enter values separated by commas or spaces.
            </div>
          </div>

          {/* Enqueue button + tooltip */}
          <div className="relative inline-block group">
            <button
              onClick={handleEnqueue}
              className="bg-seaGreen bg-opacity-50 text-backgroundLighter px-16 py-2 my-1 rounded-full hover:opacity-90 transition hover:translate-x-1 hover:translate-y-1 hover:scale-110 text-lg"
            >
              Enqueue
            </button>
            <div
              className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-5 w-max bg-darkBlue text-white text-base font-medium rounded-full py-1 px-3 opacity-0 group-hover:opacity-90 transition-opacity"
            >
              Insert the element/s to the back of the queue.
            </div>
          </div>

          {/* Dequeue button + tooltip */}
          <div className="relative inline-block group">
            <button
              onClick={handleDequeue}
              className="bg-seaGreen bg-opacity-70 text-backgroundLighter px-16 py-2 my-1 rounded-full hover:opacity-90 transition hover:translate-x-1 hover:translate-y-1 hover:scale-110 text-lg"
            >
              Dequeue
            </button>
            <div
              className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-5 w-max bg-darkBlue text-white text-base font-medium rounded-full py-1 px-3 opacity-0 group-hover:opacity-90 transition-opacity"
            >
              Removes an element from the front of the queue.
            </div>
          </div>
          {/* Peek button + tooltip */}
          <div className="relative inline-block group">
            <button
              onClick={handlePeek}
              className="bg-seaGreen bg-opacity-90 text-backgroundLighter
                         px-16 py-2 my-1 rounded-full hover:opacity-90
                         transition hover:translate-x-1 hover:translate-y-1 hover:scale-110 text-lg"
            >
              Peek
            </button>
            <div
              className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-5
                         w-max bg-darkBlue text-white text-base font-medium rounded-full py-1 px-3
                         opacity-0 group-hover:opacity-90 transition-opacity"
            >
              References the element at the front of the queue (without dequeueing it).
            </div>
          </div>
        </div>
        {/* Peek or Error message */}
        {peekValue != null ? (
          <div className="text-center text-2xl pt-10 text-darkBlue">
            Front of Queue: <strong>{peekValue}</strong>
          </div>
        ) : error ? (
          <div className="text-lg text-center text-pinkZ border-pinkZ border-2 rounded-full px-5 py-2">
            {error}
          </div>
        ) : null}
        {/* Queue display (horizontal) */}
        <div
          ref={containerRef}
          className="flex flex-wrap items-center overflow gap-3 m-8 p-4 max-h-96"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <AnimatePresence initial={false}>
            {queue.map((v, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                whileHover={{ y: -5, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="relative flex-shrink-0 w-20 h-20 bg-backgroundLighter bg-opacity-60
                           border border-seaGreen border-opacity-45 rounded-full shadow-sm
                           flex items-center justify-center text-xl"
                style={{ scrollSnapAlign: 'center' }}
              >
                <span className="font-ancizar text-xl">{v}</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: i === hovered ? 1.4 : 0 }}
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
    </div>
  );
}
