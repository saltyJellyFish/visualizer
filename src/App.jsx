/* App.jsx */
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MazeBackground from "./components/mazeBackground";
import TreesPage from "./pages/TreesPage";

const options = [
  {
    title: "Stacks & Queues",
    desc: "Visualize array operations like search, insert, delete, and sorting.",
    link: "/linkedLists",
  },
  {
    title: "Linked Lists",
    desc: "Visualize array operations like search, insert, delete, and sorting.",
    link: "/linkedLists",
  },
  {
    title: "Trees",
    desc: "See traversals and operations for singly, doubly, and circular lists.",
    link: "/trees",
  },
  {
    title: "Heaps",
    desc: "Explore traversals, insertions, deletions, and balancing.",
    link: "/heaps",
  },
  {
    title: "Hash Tables",
    desc: "Watch BFS, DFS, and shortest path algorithms in action.",
    link: "/hashTables",
  },
  {
    title: "Graphs",
    desc: "See traversals and operations for singly, doubly, and circular lists.",
    link: "/graphs",
  },
    {
    title: "Search Trees",
    desc: "See traversals and operations for singly, doubly, and circular lists.",
    link: "/trees",
  },
  {
    title: "Sorting Algorithms",
    desc: "Explore traversals, insertions, deletions, and balancing.",
    link: "/sortingAlgorithms",
  },
  
];

function HomePage() {
  return (
    <div className="main-content-wrapper">
      <div className="hero-content">
        <h1 className="hero-title">DSA Visualizer</h1>
        <div className="hero-desc">
          Interactive visualizations for data structures and algorithms.
        </div>
      </div>
      <div className="options-grid">
        {options.map((opt, idx) => (
          <div className="card-gradient-border" key={opt.link + "-" + idx}>
            <Link className="card" to={opt.link}>
              <div className="card-title">{opt.title}</div>
              <div className="card-desc">{opt.desc}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MazeBackground />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trees" element={<TreesPage />} />
        {/* TODO: add routes for linkedLists, heaps, etc. */}
      </Routes>
      <footer className="footer">
        &copy; {new Date().getFullYear()} DSA Visualizer &middot; Designed with React
      </footer>
    </BrowserRouter>
  );
}
