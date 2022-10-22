import { Buoy, Module, Plot } from '../types';
import './ModuleContent.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { LinePlot } from './Line';

function HealthModule({ module, buoy }: { module: Module; buoy: Buoy; }) {
  useEffect(() => {
    const fetchMetaData = async () => {
      const [battery, setBattery] = useState(1.0);
      for (const sensor of buoy.sensors) {
        if (sensor.format !== "metadata") continue;
        await axios
          .get(import.meta.env.VITE_API_URL + "/data/csv/" + sensor.name)
          .then((res) => {
            const jsonData = Papa.parse(res.data, { header: true }).data;

            jsonData.forEach((datarow: any) => {
              const batteryFraction: number = datarow['last_battery_fraction']
              setBattery(batteryFraction);
            });
          });
      }
    }
    fetchMetaData();
  }, [buoy.name])

  

  return (
    <div className="moduleContent">
      battery
    </div>
  );
}

export default HealthModule;
