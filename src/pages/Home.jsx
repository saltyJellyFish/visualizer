/* src/pages/Home.jsx */
import React from "react";
import { Link } from "react-router-dom";

const options = [
  {
    title: "Arrays",
    desc: "Visualize push, pop, enqueue, dequeue, and peek operations.",
    link: "/arrays",
  },
  {
    title: "Linked Lists",
    desc: "Visualize insert, delete, and traversal in singly/doubly lists.",
    link: "/linkedLists",
  },
  {
    title: "Stacks & Queues",
    desc: "Visualize push, pop, enqueue, dequeue, and peek operations.",
    link: "/stacksQueues",
  },  
  {
    title: "Trees",
    desc: "See traversals and operations for binary and n-ary trees.",
    link: "/trees",
  },
  {
    title: "Heaps",
    desc: "Explore insertions, deletions, and heapify processes.",
    link: "/heaps",
  },
  {
    title: "Hash Tables",
    desc: "Watch insert, delete, and collision‐resolution strategies.",
    link: "/hashTables",
  },
  {
    title: "Graphs",
    desc: "See BFS, DFS, and shortest‐path algorithms in action.",
    link: "/graphs",
  },
  {
    title: "Search Trees",
    desc: "Visualize BST insert/search and balancing (AVL, Red-Black).",
    link: "/searchTrees",
  },
  {
    title: "Sorting",
    desc: "Explore bubble, merge, quick, heap and more.",
    link: "/sortingAlgorithms",
  },
];

export default function Home() {
  return (
    <div className="mainContentWrapper">
      <div className="heroContent">
        <h1 className="heroTitle">DSA Visualizer</h1>
        <div className="heroDesc">
          Interactive visualizations for data structures and algorithms.
        </div>
      </div>
      <div className="optionsGrid">
        {options.map((opt, idx) => (
          <div className="cardBorder" key={idx}>
            <Link className="card" to={opt.link}>
              <div className="cardTitle">{opt.title}</div>
              <div className="cardDesc">{opt.desc}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
