import React from 'react';
import TreeVisualizer from '../components/TreeVisualizer';

const sampleData = {
  name: 'Root',
  children: [
    { name: 'Left' },
    {
      name: 'Right',
      children: [
        { name: 'R1' },
        { name: 'R2' }
      ]
    }
  ]
};

export default function TreePage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Tree Visualizer</h2>
      <TreeVisualizer data={sampleData} width={900} height={600} />
    </div>
  );
}
