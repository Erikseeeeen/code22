import { Buoy, Module, Plot } from '../types';
import './ModuleContent.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { LinePlot } from './Line';

function HealthModule({ module, buoy }: { module: Module; buoy: Buoy }) {
  const [lastBatteryFraction, setLastBatteryFraction] = useState(1.0);
  const [lastServiceTime, setLastServiceTime] = useState(0.0);
  const [lastSurfaceTime, setLastSurfaceTime] = useState(0.0);
  useEffect(() => {
    const fetchMetaData = async () => {
      for (const sensor of buoy.sensors) {
        if (sensor.format !== 'metadata') continue;
        await axios
          .get(import.meta.env.VITE_API_URL + '/data/csv/' + sensor.name)
          .then((res) => {
            const jsonData = Papa.parse(res.data, { header: true }).data;

            jsonData.forEach((datarow: any) => {
              const lastBatteryFraction: number =
                datarow['last_battery_fraction'];
              setLastBatteryFraction(lastBatteryFraction);
              const lastSurfaceTime: number = datarow['last_surface_time'];
              setLastServiceTime(lastSurfaceTime);
              const lastServiceTime: number = datarow['last_service_time'];
              setLastSurfaceTime(lastServiceTime);
            });
          });
      }
    };
    fetchMetaData();
  }, [buoy.name]);

  return (
    <div className="moduleContent">
      <p>
        Last surface time: {new Date(lastSurfaceTime * 1000).toUTCString()}
        Buoy last serviced: {new Date(lastServiceTime * 1000).toUTCString()}
        Last known battery percentage: {lastBatteryFraction * 100}%
      </p>
    </div>
  );
}

export default HealthModule;
