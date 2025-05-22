import React from "react";

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
    <div>
      {/* Background Video and Overlay */}
      <video className="hero-video-bg" autoPlay loop muted playsInline poster="/bg-fallback.jpg">
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>

      {/* Hero Section */}
      <div className="hero-content">
        <h1 className="hero-title">DSA Visualizer</h1>
        <div className="hero-desc">
          Elegant, interactive visualizations for data structures and algorithms.
        </div>
      </div>

      {/* Options */}
      <div className="options-grid">
        {options.map((opt) => (
          <a className="card" href={opt.link} key={opt.title}>
            <div className="card-title">{opt.title}</div>
            <div className="card-desc">{opt.desc}</div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} DSA Visualizer &middot; Designed with React
      </footer>
    </div>
  );
}