import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import BuoyPage from './pages/Buoy';
import Overview from './pages/Overview';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './context';
import {
  AppContextType,
  BuoySimple,
  FetchRequest,
  ModuleType,
  Project,
  Row,
} from './types';
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [fetchRequest, setFetchRequest] = useState<FetchRequest>('');

  const defaultContext: AppContextType = {
    rows: { value: rows, set: setRows },
    buoys: { value: buoys, set: setBuoys },
    projects: { value: projects, set: setProjects },
    project: { value: project, set: setProject },
    fetchRequest: { value: fetchRequest, set: setFetchRequest },
  };

  return (
    <AppContext.Provider value={defaultContext}>
      <Wrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="buoy/:name" element={<BuoyPage />} />
          </Routes>
        </BrowserRouter>
      </Wrapper>
    </AppContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
