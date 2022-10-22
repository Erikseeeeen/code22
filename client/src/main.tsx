import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import BuoyPage from './pages/Buoy';
import Overview from './pages/Overview';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Three from './components/three/Three';
import { AppContext } from './context';
import { BuoySimple, ModuleType, Row } from './types';
import axios from 'axios';
import Wrapper from './components/Wrapper';

function App() {

  const [rows, setRows] = useState<Row[]>([
    {
      id: 0,
      modules: [
        { id: 0, type: ModuleType.Map },
        { id: 1, type: ModuleType.Three },
      ],
    },
    {
      id: 1,
      modules: [{ id: 0, type: ModuleType.Chart }],
    },
  ]);
  const [buoys, setBuoys] = useState<BuoySimple[]>([]);

  const defaultContext = {
    rows: { value: rows, set: setRows },
    buoys: { value: buoys, set: setBuoys },
  };

  return (
    <AppContext.Provider value={defaultContext}>
      <Wrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="buoy/:name" element={<BuoyPage />} />
            <Route path="three" element={<Three />} />
          </Routes>
        </BrowserRouter>
      </Wrapper>
    </AppContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
