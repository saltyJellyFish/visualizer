/* src/App.jsx */
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MazeBackground from "./components/mazeBackground";
import HomePage from "./pages/Home";
import Arrays from "./pages/Arrays";
import LinkedListsPage from "./pages/LinkedLists";
import StacksQueuesPage from "./pages/StacksQueues";
import TreesPage from "./pages/Trees";
import HeapsPage from "./pages/Heaps";
import HashTablesPage from "./pages/HashTables";
import GraphsPage from "./pages/Graphs";
import SearchTreesPage from "./pages/SearchTrees";
import SortingAlgorithmsPage from "./pages/Sorting";
import NotFoundPage from "./pages/404";


export default function App() {
  return (
    <BrowserRouter>
      <MazeBackground />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/arrays" element={<Arrays />} />
        <Route path="/stacksQueues" element={<StacksQueuesPage />} />
        <Route path="/linkedLists" element={<LinkedListsPage />} />
        <Route path="/trees" element={<TreesPage />} />
        <Route path="/heaps" element={<HeapsPage />} />
        <Route path="/hashTables" element={<HashTablesPage />} />
        <Route path="/graphs" element={<GraphsPage />} />
        <Route path="/searchTrees" element={<SearchTreesPage />} />
        <Route path="/sortingAlgorithms" element={<SortingAlgorithmsPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* TODO: add a 404 <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>

      <footer className="footer">
        &copy; {new Date().getFullYear()} DSA Visualizer &middot; Designed with React
      </footer>
    </BrowserRouter>
);
}
