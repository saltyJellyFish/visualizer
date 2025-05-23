import React from "react";
import MazeBackground from "./components/mazeBackground"; // Ensure this path is correct

const options = [
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
    title: "Sorting Algorithms",
    desc: "Explore traversals, insertions, deletions, and balancing.",
    link: "/sortingAlgorithms",
  },
];

export default function App() {
  return (
    <>
      <div className="main-content-wrapper">
      <MazeBackground /> 
        {/* Hero Section */}
        <div className="hero-content" >
          <h1 className="hero-title">DSA Visualizer</h1>
          <div className="hero-desc">
            Interactive visualizations for data structures and algorithms.
          </div>
        </div>
        {/* Options */}
        <div className="options-grid">
          {options.map((opt, index) => (
            <div className="card-gradient-border" key={opt.link + '-' + index}>
              <a className="card" href={opt.link}>
                <div className="card-title">{opt.title}</div>
                <div className="card-desc">{opt.desc}</div>
              </a>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <footer className="footer">
          &copy; {new Date().getFullYear()} DSA Visualizer &middot; Designed with React
        </footer>
      </div>
    </>
  );
}
