import React from 'react';
import { Link } from 'react-router-dom';   

export default function Graphs() {
  return (
    <div className="mainContentWrapper p-8">
      <Link className="text-2xl text-darkBlue font-bold" to="/">
        <div className="text-2xl text-darkBlue font-bold">DSA</div>
      </Link>
      <h2 className="text-3xl text-darkBlue font-bold place-self-center">
        Graphs Visualizer
      </h2>    
    </div>
  );
}
