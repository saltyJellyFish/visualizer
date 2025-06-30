import React from 'react';
import { Link } from 'react-router-dom';

export function BackToHomeButton() {
  return (
    <Link to="/" className="homeLink">
      ← Back to Home
    </Link>
  );
}
