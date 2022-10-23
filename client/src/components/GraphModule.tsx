import { Buoy, Module, Plot, Sensor } from '../types';
import './ModuleContent.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { LinePlot } from './Line';
import Loading from './Loading';

function GraphModule({ module, buoy }: { module: Module; buoy: Buoy }) {
  const [plot, setPlot] = useState<Plot>();
  const [plotSensor, setPlotSensor] = useState<Sensor>();
  const [from, setFrom] = useState<Date>(new Date());
  const [to, setTo] = useState<Date>(new Date());

  useEffect(() => {
    if (buoy.sensors.length == 0) return;
    axios
      .get(import.meta.env.VITE_API_URL + '/data/csv/' + plotSensor?.name)
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
          x: jsonData
            .map((p: any) => p['0'] as number)
            .filter((p) => p != undefined),
          y: jsonData
            .map((p: any) => p['1'] as number)
            .filter((p) => p != undefined),
          headers: headers,
          color: { r: 25, g: 100, b: 200 },
          limLow: plotSensor?.limit_low ?? 0,
          limHigh: plotSensor?.limit_high ?? 0,
          recommendedLow: plotSensor?.recommended_low ?? 0,
          recommendedHigh: plotSensor?.recommended_high ?? 0,
          from: from,
          to: to,
        };
        for (const warning of buoy.warnings) {
          if (warning.name == plotSensor?.name && warning.diffs.length > 0) {
            plot.diffs = warning.diffs;
          }
        }
        setPlot(plot);
      });
  }, [plotSensor, from, to]);

  useEffect(() => {
    setPlotSensor(buoy.sensors.find((sensor) => sensor.format == 'csv'));
  }, [buoy.name]);
  useEffect(() => {
    setPlotSensor(buoy.sensors.find((sensor) => sensor.format == 'csv'));
  }, []);
  return plot ? (
    <div className="moduleContent">
      <select
        style={{ margin: 12 }}
        value={plotSensor?.name}
        onChange={(e) =>
          setPlotSensor(buoy.sensors.find((s) => s.name == e.target.value))
        }
      >
        {' '}
        {buoy.sensors
          .filter((sensor) => sensor.format == 'csv') // csv outputs can be chosen
          .map((sensor) => (
            <option>{sensor.name}</option>
          ))}
      </select>
      <div className={'datePickers'}>
        <div className={'datePicker'}>
          From:{' '}
          <input
            type="datetime-local"
            onChange={(e) => {
              setFrom(e.target.valueAsDate ?? new Date());
            }}
          />
        </div>
        <div className={'datePicker'}>
          To:{' '}
          <input
            type="datetime-local"
            onChange={(e) => {
              setTo(e.target.valueAsDate ?? new Date());
            }}
          />
        </div>
      </div>
      <LinePlot plot={plot} />
    </div>
  ) : (
    <Loading />
  );
}

export default GraphModule;
