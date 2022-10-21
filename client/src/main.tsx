import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import Hello from './pages/Hello';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Three from './pages/Three';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="hello" element={<Hello />} />
        <Route path="three" element={<Three />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
