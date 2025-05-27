// src/pages/Arrays.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ArrayVisualizer from '../components/ArrayVisualizer';

export default function Arrays() {
  return (
    <div className="mainContentWrapper p-10 font-ancizar">
      <Link to="/" className="homeLink">← Back to Home
      </Link>
      <div className="my-20">
        <h1 className="dsaName">Arrays Visualizer</h1>
        <p className="dsaDesc">Push, pop, and highlight elements in your array.</p>
      </div>
      <div className="cardDesc">
        <ArrayVisualizer initial={[10, 20, 30, 40, 50]} />
      </div>
      <footer className="footer mt-auto">
        &copy; {new Date().getFullYear()} DSA Visualizer
      </footer>
    </div>
  );
}
