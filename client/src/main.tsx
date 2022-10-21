import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './pages/Dashboard';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Three from './pages/Three';
import { AppContext } from './context';
import { Row } from './types';

function App() {
  const [rows, setRows] = useState<Row[]>([]);

  const defaultContext = {
    rows: { value: rows, set: setRows },
  };

  return (
    <AppContext.Provider value={defaultContext}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="three" element={<Three />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
