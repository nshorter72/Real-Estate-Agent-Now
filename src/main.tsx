import React from 'react';
import { createRoot } from 'react-dom/client';
import RealEstateAgent from './RealEstateAgent';
import './index.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <RealEstateAgent />
    </React.StrictMode>
  );
}
