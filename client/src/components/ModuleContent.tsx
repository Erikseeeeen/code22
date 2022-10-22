import { Buoy, Module, ModuleType } from '../types';
import './ModuleContent.css';
import Three from './three/Three';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { LinePlot } from './Line';

function ModuleContent({ module, buoy }: { module: Module; buoy: Buoy }) {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    if (module.type !== ModuleType.Chart || buoy.sensors.length == 0) return;
    const h: string[] = [];
    axios
      .get(import.meta.env.VITE_API_URL + '/data/csv/' + buoy.sensors[0].name)
      .then((res) => {
        const jsonData = Papa.parse(res.data, {
          header: true,
          transformHeader: (header, index) => {
            h.push(header);
            return `${index}`;
          },
        }).data;
        setData(jsonData);
      });
    setHeaders(h);
  }, [buoy.name]);

  if (module.type === ModuleType.Three) {
    return (
      <div className="moduleContent">
        <Three />
      </div>
    );
  }
  if (module.type === ModuleType.Chart && buoy.sensors.length > 0) {
    return (
      <div className="moduleContent">
        <LinePlot
          x={data.map((p) => p['0'] as number)}
          y={data.map((p) => p['1'] as number)}
          headers={headers}
        />
      </div>
    );
  }
  return (
    <div className="moduleContent">
      <h1 style={{ padding: 10 }}>Module</h1>
    </div>
  );
}

export default ModuleContent;
