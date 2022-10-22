import { Buoy, Module, ModuleType } from '../types';
import './ModuleContent.css';
import Three from './three/Three';
import axios from 'axios';
import { useState } from 'react';
import Papa from 'papaparse';
import { LinePlot } from './Line';

function ModuleContent({ module, buoy }: { module: Module; buoy: Buoy }) {
  const [data, setData] = useState<any[]>([]);

  if (module.type === ModuleType.Three) {
    return (
      <div className="moduleContent">
        <Three />
      </div>
    );
  }
  if (module.type === ModuleType.Chart && buoy.sensors.length > 0) {
    axios
      .get(import.meta.env.VITE_API_URL + '/data/csv/' + buoy.sensors[0].name)
      .then((res) => {
        setData(Papa.parse(res.data, { header: true }).data);
      });
    return (
      <div className="moduleContent">
        <LinePlot></LinePlot>
      </div>
    );
  }
  return (
    <div className="moduleContent">
      <h1 style={{padding: 10}}>Module</h1>
    </div>
  );
}

export default ModuleContent;
