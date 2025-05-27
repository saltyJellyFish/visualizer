// src/pages/LinkedLists.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LinkedListVisualizer from '../components/LLVisualizer';

export default function LinkedListPage() {
  return (
    <div className="mainContentWrapper p-10 font-ancizar">
      <Link to="/" className="homeLink">
        ← Back to Home
      </Link>
      <div className="my-20 flex flex-col items-center">
        <h1 className="dsaName">Linked List Visualizer</h1>
        <p className="dsaDesc">
          Visualize how elements are inserted, removed, and managed in a linked list structure.
        </p>
      </div>

      <div className="cardDesc p-2">
        <LinkedListVisualizer initial={[1, 2, 3, 4]} />
      </div>

      <footer className="footer">
        &copy; {new Date().getFullYear()} DSA Visualizer
      </footer>
    </div>
  );
}
