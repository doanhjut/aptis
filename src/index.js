import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Part2 from './part2/part2';
import Part3 from './part3/part3';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/part2" element={<Part2 />} />
      <Route path="/part3" element={<Part3 />} />
    </Routes>
  </BrowserRouter>
);