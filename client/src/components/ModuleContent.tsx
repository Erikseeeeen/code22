import { Buoy, Module, ModuleType, Plot } from '../types';
import './ModuleContent.css';
import Three from './three/Three';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { LinePlot } from './Line';

function ModuleContent({ module, buoy }: { module: Module; buoy: Buoy }) {
  const [plots, setPlots] = useState<Plot[]>([]);

  useEffect(() => {
    if (module.type !== ModuleType.Chart || buoy.sensors.length == 0) return;
    const newPlots: Plot[] = [];
    const promises: Promise<void>[] = [];
    for (const sensor of buoy.sensors) {
      if (sensor.format != "csv") {
        continue;
      }
      const promise = axios
        .get(import.meta.env.VITE_API_URL + '/data/csv/' + sensor.name)
        .then((res) => {
          const headers: string[] = [];
          const jsonData = Papa.parse(res.data, {
            header: true,
            transformHeader: (header, index) => {
              headers.push(header);
              return `${index}`;
            },
          }).data;
          const plot: Plot = {
            x: jsonData.map((p: any) => p['0'] as number),
            y: jsonData.map((p: any) => p['1'] as number),
            headers: headers,
          };
          newPlots.push(plot);
        });
      promises.push(promise);
    }
    Promise.all(promises).then(() => {
      setPlots(newPlots);
    });
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
        <LinePlot plots={plots} />
      </div>
    );
  }

  if (module.type === ModuleType.Video) {
    return (
      <div className="moduleContent">
        <video>
          <source src="/heidrun_2_camera.mp4" type="video/mp4" />
        </video>
      </div>
    )
  }
  return (
    <div className="moduleContent">
      <h1 style={{ padding: 10 }}>Module</h1>
    </div>
  );
}

export default ModuleContent;
