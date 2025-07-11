// src/pages/Arrays.jsx
import React from 'react';
import ArrayVisualizer from '../components/ArrayVisualizer';
import * as Layout from '../components/layout';

export default function Arrays() {
  return (
    <VisualizerPage
      title="Arrays Visualizer"
      description="Push, pop, and highlight elements in your array."
    >
      <ArrayVisualizer initial={[10, 20, 30, 40, 50]} />
    </VisualizerPage>
  );
}

