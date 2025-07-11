import React from 'react';
import { Link } from 'react-router-dom';

export function BackToHomeButton() {
  return (
    <Link to="/" className="homeLink">
      ← Back to Home
    </Link>
  );
}
export default function VisualizerPage({ title, description, children }) {
  return (
    <div className="mainContentWrapper p-10 font-ancizar">
      <Layout.BackToHomeButton />
      <div className="my-20">
        <h1 className="dsaName">{title}</h1>
        <p className="dsaDesc">{description}</p>
      </div>
      <div className="cardDesc">
        {children}
      </div>
      <footer className="footer mt-auto">
        &copy; {new Date().getFullYear()} DSA Visualizer
      </footer>
    </div>
  );
}
export function ButtonZ({ buttons }) {
  return (
    <div className="buttonGroup">
      {buttons.map(({ label, action, opacity, hoverText }) => (
        <div key={label} className="relative inline-block group">
          <button
            onClick={action}
            className={`buttons ${opacity} bg-seaGreen flex-initial min-w-0`}
          >
            {label}
          </button>
          <div className="buttonHover">
            {hoverText}
          </div>
        </div>
      ))}
    </div>
  );
}
export function InputValue({ inputValue, setInputValue }) {
  return (
    <div className="contents">
      <input
        type="text"
        placeholder="Input elements"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className="searchBoxPlaceholder"
      />
      <div className="buttonHover">
        Enter values separated by commas or spaces.
      </div>
    </div>
  );
}
export function InputIndex({ insertIndex, setInsertIndex }) {
  return (
    <div className="contents">
      <input
          type="number"
          placeholder="Index (optional)"
          value={insertIndex}
          onChange={e => setInsertIndex(e.target.value)}
          className="searchBoxPlaceholder"
        />
      <div className="buttonHover">
                Specify index for insertion/removal (leave empty for end/last).
              </div>
    </div>
  );
}
export function insertion({ inputValue, setError, setInputValue }) {
  return function(updateStructure) {
    setError('');
    const vals = inputValue.split(/[\s,]+/).filter(v => v);
    if (!vals.length) {
      setError('Enter one or more values.');
      return;
    }
    updateStructure(prev => [...prev, ...vals]);
    setInputValue('');
  };
}

export function Deletion({ setError, emptyMessage }) {
  return function(updateStructure, getStructure, removeFn) {
    setError('');
    const current = getStructure();
    if (current.length === 0) {
      setError(emptyMessage);
      return;
    }
    updateStructure(removeFn(current));
  };
}

export function Peek({ setError, setPeekValue, emptyMessage }) {
  return function(getStructure, peekFn) {
    setError('');
    const current = getStructure();
    if (current.length === 0) {
      setError(emptyMessage);
      return;
    }
    setPeekValue(peekFn(current));
  };
}

