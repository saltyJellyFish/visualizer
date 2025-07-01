// src/components/SQVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Layout from '../components/layout';


//ADD: Allow picking and moving elements around.
//ADD: Make it save state in local storage so it persists across stack/queue changes. OR could add both stack and queue in the same page as two different visualizers.
//ADD: Add desctiptions for S/Qs.

export function SQVisualizer({ initial = [], type = 'stack' }) {
  const [data, setData] = useState(initial);
  const [hovered, setHovered] = useState(null);
  const [peekValue, setPeekValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef();

  const isStack = type === 'stack';

  const handleInsert = Layout.insertion({ inputValue, setError, setInputValue });

  useEffect(() => {
    if (peekValue != null) {
      const t = setTimeout(() => setPeekValue(null), 5000);
      return () => clearTimeout(t);
    }
  }, [peekValue]);

  const handleRemove = () =>
    Layout.Deletion({
      setError,
      emptyMessage: isStack ? 'Stack is empty.' : 'Queue is empty.',
    })(
      setData,
      () => data,
      d => isStack ? d.slice(0, -1) : d.slice(1)
    );

  const handlePeek = () =>
    Layout.Peek({
      setError,
      setPeekValue,
      emptyMessage: isStack ? 'Stack is empty.' : 'Queue is empty.',
    })(
      () => data,
      d => isStack ? d[d.length - 1] : d[0]
    );

  const buttons = [
    {
      label: isStack ? 'Push' : 'Enqueue',
      action: () => handleInsert(setData),
      opacity: 'bg-opacity-70',
      hoverText: isStack
        ? 'Insert the element(s) at the top of the stack.'
        : 'Insert the element(s) to the back of the queue.',
    },
    {
      label: isStack ? 'Pop' : 'Dequeue',
      action: handleRemove,
      opacity: 'bg-opacity-85',
      hoverText: isStack
        ? 'Deletes the element at the top of the stack.'
        : 'Removes the element at the front of the queue.',
    },
    {
      label: isStack ? 'Peek (Top)' : 'Peek (Front)',
      action: handlePeek,
      opacity: 'bg-opacity-95',
      hoverText: isStack
        ? 'References the element at the top (without popping).'
        : 'References the element at the front (without removing).',
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      <div className="tanBox">
        <div className="nbar">
          <Layout.InputValue inputValue={inputValue} setInputValue={setInputValue} />
          <Layout.ButtonZ buttons={buttons} />
        </div>

        {peekValue != null ? (
          <div className="text-center text-2xl pt-10 text-darkBlue">
            {isStack ? 'Top of Stack' : 'Front of Queue'}: <strong>{peekValue}</strong>
          </div>
        ) : error ? (
          <div className="errorText">{error}</div>
        ) : null}

        <div
          ref={containerRef}
          className={isStack
            ? 'flex flex-col-reverse items-center gap-3 mt-8 m-8 p-4'
            : 'flex flex-wrap items-center overflow gap-3 m-8 p-4 max-h-96'}
          style={isStack ? {} : { scrollSnapType: 'x mandatory' }}
        >
          <AnimatePresence initial={false}>
            {data.map((v, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, [isStack ? 'x' : 'y']: 50 }}
                animate={{ opacity: 1, [isStack ? 'x' : 'y']: 0 }}
                exit={{ opacity: 0, [isStack ? 'x' : 'y']: -50 }}
                whileHover={{ y: -5, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="node"
                style={!isStack ? { scrollSnapAlign: 'center' } : {}}
              >
                <span className="font-ancizar text-xl p-3">{v}</span>
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
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
