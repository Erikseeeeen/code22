import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Buoy from './pages/Buoy';
import Overview from './pages/Overview';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Three from './pages/Three';
import { AppContext } from './context';
import { Row } from './types';

function App() {
  const [rows, setRows] = useState<Row[]>([
    {
      id: 0,
      modules: [{ id: 0 }, { id: 1 }],
    },
    {
      id: 1,
      modules: [{ id: 0 }],
    },
  ]);

  const defaultContext = {
    rows: { value: rows, set: setRows },
  };

  return (
    <AppContext.Provider value={defaultContext}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="buoy/:name" element={<Buoy />} />
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
