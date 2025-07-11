import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function BackToHomeButton() {
  return (
    <Link to="/" className="homeLink">
      ← Back to Home
    </Link>
  );
}

export function NodeDisplay({ value, index, hovered, highlighted = null, className = "node" }) {
  return (
    <div className={className}>
      <span className="font-ancizar text-xl">{value}</span>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: index === hovered || index === highlighted ? 1.4 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="nodeHover"
      >
        {index}
      </motion.span>
    </div>
  );
}

export function ButtonZ({ buttons }) {
  return (
    <div className="flex space-x-4">
      {buttons.map(({ label, action, opacity, hoverText }) => (
        <div key={label} className="relative inline-block group">
          <button
            onClick={action}
            className={`buttons ${opacity} bg-seaGreen`}
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
    <div className="relative inline-block group">
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

