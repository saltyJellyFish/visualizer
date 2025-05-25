// src/pages/StacksQueuesPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StackVisualizer from '../components/StackVisualizer';
import QueueVisualizer from '../components/QueueVisualizer';

export default function StacksQueues() {
  const [mode, setMode] = useState('stack');

  return (
    <div className="mainContentWrapper p-10 font-ancizar">
      <Link to="/" className="text-m text-darkBlue font-semibold hover:underline inline-block">← Back to Home
      </Link>
      <div className="my-20 flex flex-col items-center">
        <h1 className="text-3.5xl text-darkBlue font-bold place-self-center">Stacks & Queues</h1>
        <p className="text-xl text-darkBlue font-bold place-self-center"> Choose whether you want to visualize a Stack (LIFO) or a Queue (FIFO).
        </p>
        </div>
        {/* Mode toggle */}
        <div className="flex mt-6 space-x-4 justify-center">
          {['stack', 'queue'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 py-2 rounded-full font-semibold transition
                ${mode === m 
                  ? 'bg-seaGreen bg-opacity-80 text-backgroundLighter' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {m === 'stack' ? 'Stack' : 'Queue'}
            </button>
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
