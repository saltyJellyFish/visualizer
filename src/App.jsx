/* src/App.jsx */
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MazeBackground from "./components/mazeBackground";
import Home from "./pages/Home";
import Arrays from "./pages/Arrays";
import LinkedLists from "./pages/LinkedLists";
import StacksQueues from "./pages/StacksQueues";
import Trees from "./pages/Trees";
import Heaps from "./pages/Heaps";
import HashTables from "./pages/HashTables";
import Graphs from "./pages/Graphs";
import SearchTrees from "./pages/SearchTrees";
import Sorting from "./pages/Sorting";
import NotFoundPage from "./pages/404";

export default function App() {
  return (
    <BrowserRouter>
      <MazeBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arrays" element={<Arrays />} />
        <Route path="/stacksQueues" element={<StacksQueues />} />
        <Route path="/linkedLists" element={<LinkedLists />} />
        <Route path="/trees" element={<Trees />} />
        <Route path="/heaps" element={<Heaps />} />
        <Route path="/hashTables" element={<HashTables />} />
        <Route path="/graphs" element={<Graphs />} />
        <Route path="/searchTrees" element={<SearchTrees />} />
        <Route path="/sortingAlgorithms" element={<Sorting />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>

      <footer className="footer">
        &copy; {new Date().getFullYear()} DSA Visualizer &middot; Designed with React
      </footer>
    </BrowserRouter>

  );
}
