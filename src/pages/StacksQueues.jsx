// src/pages/StacksQueuesPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StackVisualizer, QueueVisualizer }
  from '../components/SQVisualizer.jsx'; import * as Layout from '../components/layout';
import { stack } from 'd3';
import { common } from '../textContent';


export default function StacksQueues() {
  const [mode, setMode] = useState('stack');
  return (
    <div className="mainContentWrapper p-10 font-ancizar">
      <Layout.BackToHomeButton />
      <div className="my-20 flex flex-col items-center">
        <h1 className="dsaName">Stacks & Queues Visualizer</h1>
        <p className="dsaDesc"> Choose whether you want to visualize a Stack (LIFO) or a Queue (FIFO).
        </p>
      </div>
      {/* Mode toggle */}
      <div className="flex space-x-8 justify-center">
        {['stack', 'queue'].map(m => (
          <div key={m} className="relative group">
            <button
              onClick={() => setMode(m)}
              className={`px-12 py-3 rounded-full text-xl font-semibold transition
                ${mode === m
                  ? 'bg-seaGreen bg-opacity-80 text-backgroundLighter'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  `}
            >
              {m === 'stack' ? 'Stack' : 'Queue'}
            </button>
            <div className="bottonHover"      >
              {m === 'stack' ? common.stackDescription : common.queueDescription}
            </div>
          </div>
        ))}
      </div>
      {/* Visualizer */}
      <div className=" cardDesc p-2">
        {mode === 'stack'
          ? <StackVisualizer initial={[1, 2, 3, 4]} />
          : <QueueVisualizer initial={[1, 2, 3, 4]} />
        }
      </div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} DSA Visualizer
      </footer>
    </div>
  );
}