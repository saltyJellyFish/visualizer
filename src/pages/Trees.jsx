import React from 'react';
import TreeVisualizer from '../components/TreeVisualizer';
import { Link } from 'react-router-dom';   


const sampleData = {
  name: 'Root',
  children: [
    { name: 'Left' },
    {
      name: 'Right',
      children: [
        { name: 'R1' },
        { name: 'R2' }
      ]
    }
  ]
};

export default function Trees() {
  return (
    <div className="mainContentWrapper p-10 font-ancizar">
      <Layout.BackToHomeButton />
          <div className="my-20 flex flex-col items-center">
        <h1 className="dsaName">Trees Visualizer</h1>
        <p className="dsaDesc">
          Choose between Binary, Ternary, or N-ary Linked Lists and interactively modify their structure.
        </p>
      </div>
      {/* Mode Toggle */}
      <div className="flex space-x-4 justify-center">
        {['Binary', 'Ternary', 'N-ary'].map(type => (
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
        <LinkedListVisualizer initial={["A", "B", "C", "D", "E"]} selectedType={mode} />
      </div>

      <footer className="footer">
        &copy; {new Date().getFullYear()} DSA Visualizer
      </footer>
    </div>
  );
}


