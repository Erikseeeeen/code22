import { Buoy, Module, ModuleType, Plot, Sensor } from "../types";
import "./ModuleContent.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { LinePlot } from "./Line";

function GraphModule({ module, buoy }: { module: Module; buoy: Buoy }) {
  const [plot, setPlot] = useState<Plot>();
  const [plotSensor, setPlotSensor] = useState<Sensor>();

  useEffect(() => {
    if (buoy.sensors.length == 0) return;
    axios
      .get(import.meta.env.VITE_API_URL + "/data/csv/" + plotSensor?.name)
      .then((res) => {
        const headers: string[] = [];
        const jsonData = Papa.parse(res.data, {
          header: true,
          transformHeader: (header, index) => {
            headers.push(header);
            return `${index}`;
          },
        }).data;
        const data: number[][] = jsonData as number[][];

        const plot: Plot = {
          x: jsonData
            .map((p: any) => p["0"] as number)
            .filter((p) => p != undefined),
          y: jsonData
            .map((p: any) => p["1"] as number)
            .filter((p) => p != undefined),
          headers: headers,
          color: { r: 25, g: 100, b: 200 },
          limLow: plotSensor?.limit_low ?? 0,
          limHigh: plotSensor?.limit_high ?? 0,
          recommendedLow: plotSensor?.recommended_low ?? 0,
          recommendedHigh: plotSensor?.recommended_high ?? 0,
        };

        setPlot(plot);
      });
  }, [plotSensor]);

  useEffect(() => {
    setPlotSensor(buoy.sensors.find((sensor) => sensor.format == "csv"));
  }, [buoy.name]);

  return (
    <div className="moduleContent">
      <select
        value={plotSensor?.name}
        onChange={(e) =>
          setPlotSensor(buoy.sensors.find((s) => s.name == e.target.value))
        }
      >
        {" "}
        {buoy.sensors
          .filter((sensor) => sensor.format == "csv") // csv outputs can be chosen
          .map((sensor) => (
            <option>{sensor.name}</option>
          ))}
      </select>
      <LinePlot plot={plot} />
    </div>
  );
}

export default GraphModule;
