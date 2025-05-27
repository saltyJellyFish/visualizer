// src/components/SQVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

//ADD: Allow picking and moving elements around.

/* StackVisualizer */
export function StackVisualizer({ initial = [] }) {
  const [stack, setStack]       = useState(initial);
  const [hovered, setHovered]   = useState(null);
  const [peekValue, setPeekValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError]       = useState('');
  const containerRef            = useRef();

  useEffect(() => {
    if (peekValue != null) {
      const t = setTimeout(() => setPeekValue(null), 5000);
      return () => clearTimeout(t);
    }
  }, [peekValue]);

  const handlePush = () => {
    setError('');
    const vals = inputValue.split(/[\s,]+/).filter(v => v);
    if (!vals.length) {
      setError('Enter one or more values to push.');
      return;
    }
    setStack(s => [...s, ...vals]);
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
    if (!stack.length) {
      setError('Stack is empty.');
      return;
    }
    setPeekValue(stack[stack.length - 1]);
  };

  return (
    <div className="flex flex-col items-center space-y-6 mb-20">
      {/* Toolbar */}
      <div className="tanBox">
        <div className="nbar">
          {/* Input */}
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

          {/* Push */}
          <div className="relative inline-block group">
            <button
              onClick={handlePush}
              className= "bg-opacity-50 buttons"
            >
              Push
            </button>
            <div className="bottonHover">

              Insert the element(s) at the top of the stack.
            </div>
          </div>
          <div className="relative inline-block group">
            <button
              onClick={handlePop}
              className="bg-opacity-70 buttons">
              Pop
            </button>
            <div className="bottonHover">

              Deletes the element at the top of the stack.
            </div>
          </div>

          {/* Peek */}
          <div className="relative inline-block group">
            <button
              onClick={handlePeek}
              className=" bg-opacity-85 buttons"
            >
              Peek
            </button>
            <div className="bottonHover">
              References the element at the top (without popping).
            </div>
          </div>
        </div>

        {/* Peek or Error */}
        {peekValue != null ? (
          <div className="text-center text-2xl pt-10 text-darkBlue">
            Top of Stack: <strong>{peekValue}</strong>
          </div>
        ) : error ? (
          <div className="errorText">
            {error}
          </div>
        ) : null}

        {/* Stack display */}
        <div ref={containerRef}
             className="flex flex-col-reverse items-center gap-3 mt-8 m-8 p-4">
          <AnimatePresence initial={false}>
            {stack.map((v,i) => (
              <motion.div
                key={i}
                layout initial={{opacity:0,x:50}} 
                animate={{opacity:1,x:0}}
                exit={{opacity:0,x:-50}}
                whileHover={{y:-5,boxShadow:'0 4px 10px rgba(0,0,0,0.15)'}}
                onHoverStart={()=>setHovered(i)}
                onHoverEnd={()=>setHovered(null)}
                className="node"
              >
                <span className="font-ancizar text-xl p-3">{v}</span>
                <motion.span
                  initial={{scale:0}}
                  animate={{scale: i===hovered?1.4:0}}
                  transition={{type:'spring',stiffness:300,damping:20}}
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

/* QueueVisualizer */

export function QueueVisualizer({ initial = [] }) {
  const [queue, setQueue]       = useState(initial);
  const [hovered, setHovered]   = useState(null);
  const [peekValue, setPeekValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError]       = useState('');
  const containerRef            = useRef();

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
      <div className="tanBox">
        <div className="nbar">
          
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
              Enter values separated by commas or spaces.
            </div>
          </div>

          {/* Enqueue */}
          <div className="relative inline-block group">
            <button
              onClick={handleEnqueue}
              className=" bg-opacity-50 buttons"
            >
              Enqueue
            </button>
            <div className="bottonHover">
              Insert the element(s) to the back of the queue.
            </div>
          </div>

          {/* Dequeue */}
          <div className="relative inline-block group">
            <button
              onClick={handleDequeue}
              className=" bg-opacity-70 buttons"
            >
              Dequeue
            </button>
            <div className="bottonHover">

              Removes the element at the front of the queue.
            </div>
          </div>

          {/* Peek */}
          <div className="relative inline-block group">
            <button
              onClick={handlePeek}
              className=" bg-opacity-85 buttons"
            >
              Peek
            </button>
            <div className="bottonHover">
              References the element at the front (without removing).
            </div>
          </div>
        </div>

        {/* Peek or Error */}
        {peekValue != null ? (
          <div className="text-center text-2xl pt-10 text-darkBlue">
            Front of Queue: <strong>{peekValue}</strong>
          </div>
        ) : error ? (
          <div className="errorText">
            {error}
          </div>
        ) : null}

        {/* Queue display */}
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
