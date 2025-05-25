import React from 'react';
import TreeVisualizer from '../components/TreeVisualizer';
import { Link } from 'react-router-dom';   


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

export default function Trees() {
  return (
    <div className="mainContentWrapper p-8">
      <Link className="text-2xl text-darkBlue font-bold" to="/">
        <div className="text-2xl text-darkBlue font-bold">DSA</div>
      </Link>
      <h2 className="text-2xl font-bold text-darkBlue m-4">Tree Visualizer</h2>
      <TreeVisualizer data={sampleData} width={900} height={600} />
    </div>
  );
}
