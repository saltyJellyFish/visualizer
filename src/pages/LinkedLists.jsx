// src/pages/LinkedListsPage.jsx
import React, { useState } from 'react';
import LinkedListVisualizer from '../components/LLVisualizer';
import * as Layout from '../components/layout';

export default function LinkedListsPage() {
  const [mode, setMode] = useState('Singly');

  return (
    <div className="mainContentWrapper p-10 font-ancizar">
      <Layout.BackToHomeButton />
      <div className="my-20 flex flex-col items-center">
        <h1 className="dsaName">Linked List Visualizer</h1>
        <p className="dsaDesc text-center max-w-4xl">
          Choose between Singly, Doubly, or Circular Linked Lists and interactively modify their structure.
        </p>
      </div>
      {/* Mode Toggle */}
      <div className="flex space-x-8 justify-center mb-8">
        {['Singly', 'Doubly', 'Circular'].map(type => (
          <button
            key={type}
            onClick={() => setMode(type)}
            className={`px-12 py-3 rounded-full text-xl font-semibold transition
              ${mode === type
                ? 'bg-seaGreen bg-opacity-80 text-backgroundLighter'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Visualizer */}
      <div className="cardDesc p-2">
        <LinkedListVisualizer initial={["A", "B", "C"]} selectedType={mode} />
      </div>

      {/* Code View */}
      <div className="flex justify-center mt-8">
        <Layout.CodeView dataStructure={mode} />
      </div>

      <footer className="footer mt-auto">
        &copy; {new Date().getFullYear()} DSA Visualizer
      </footer>
    </div>
  );
}