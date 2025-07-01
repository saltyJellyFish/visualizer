// src/components/SQVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
//ADD: Allow picking and moving elements around.
//ADD: Make it save state in local storage so it persists across stack/queue changes. OR could add both stack and queue in the same page as two different visualizers.
//ADD: Add desctiptions for S/Qs.

import * as Layout from '../components/layout';

export function StackVisualizer({ initial = [] }) {
  const [stack, setStack] = useState(initial);
  const [hovered, setHovered] = useState(null);
  const [peekValue, setPeekValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef();

  const handleInsert = Layout.insertion({ inputValue, setError, setInputValue });

  useEffect(() => {
    if (peekValue != null) {
      const t = setTimeout(() => setPeekValue(null), 5000);
      return () => clearTimeout(t);
    }
  }, [peekValue]);

  const handlePop = () => Layout.Deletion({
    setError,
    emptyMessage: 'Stack is empty.',
  })(setStack, () => stack, s => s.slice(0, -1));

  const handlePeek = () => Layout.Peek({ setError, setPeekValue, emptyMessage: 'Stack is empty.', })(() => stack, s => s[s.length - 1]);

  const buttons = [
    { label: 'Push', action: () => handleInsert(setStack), opacity: 'bg-opacity-70', hoverText: 'Insert the element(s) at the top of the stack.' },
    { label: 'Pop', action: handlePop, opacity: 'bg-opacity-85', hoverText: 'Deletes the element at the top of the stack.' },
    { label: 'Peek', action: handlePeek, opacity: 'bg-opacity-95', hoverText: 'References the element at the top (without popping).' },
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
            Top of Stack: <strong>{peekValue}</strong>
          </div>
        ) : error ? (
          <div className="errorText">
            {error}
          </div>
        ) : null}
        <div ref={containerRef}
          className="flex flex-col-reverse items-center gap-3 mt-8 m-8 p-4">
          <AnimatePresence initial={false}>
            {stack.map((v, i) => (
              <motion.div
                key={i}
                layout initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                whileHover={{ y: -5, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="node"
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
export function QueueVisualizer({ initial = [] }) {
  const [queue, setQueue] = useState(initial);
  const [hovered, setHovered] = useState(null);
  const [peekValue, setPeekValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef();

  const handleInsert = Layout.insertion({ inputValue, setError, setInputValue });

  useEffect(() => {
    if (peekValue != null) {
      const t = setTimeout(() => setPeekValue(null), 5000);
      return () => clearTimeout(t);
    }
  }, [peekValue]);

  const handleDequeue = () =>
    Layout.Deletion({ setError, emptyMessage: 'Queue is empty.', })(setQueue, () => queue, q => q.slice(1));

  const handlePeek = () =>
    Layout.Peek({
      setError,
      setPeekValue,
      emptyMessage: 'Queue is empty.',
    })(() => queue, q => q[0]);


  const buttons = [
    { label: 'Enqueue', action: () => handleInsert(setQueue), opacity: 'bg-opacity-70', hoverText: 'Insert the element(s) to the back of the queue.' },
    { label: 'Dequeue', action: handleDequeue, opacity: 'bg-opacity-85', hoverText: 'Removes the element at the front of the queue.' },
    { label: 'Peek', action: handlePeek, opacity: 'bg-opacity-95', hoverText: 'References the element at the front (without removing).' },
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
            Front of Queue: <strong>{peekValue}</strong>
          </div>
        ) : error ? (
          <div className="errorText">
            {error}
          </div>
        ) : null}
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
                className="node"
                style={{ scrollSnapAlign: 'center' }}
              >
                <span className="font-ancizar text-xl">{v}</span>
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
