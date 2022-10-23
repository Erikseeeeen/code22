import { Buoy, Module, Plot } from "../types";
import "./ModuleContent.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { LinePlot } from "./Line";
import { flexbox } from "@mui/system";

function HealthModule({ module, buoy }: { module: Module; buoy: Buoy }) {
  const [lastBatteryFraction, setLastBatteryFraction] = useState<
    number | undefined
  >(undefined);
  const [lastServiceTime, setLastServiceTime] = useState<number | undefined>(
    undefined
  );
  const [lastSurfaceTime, setLastSurfaceTime] = useState<number | undefined>(
    undefined
  );
  useEffect(() => {
    const fetchMetaData = async () => {
      for (const sensor of buoy.sensors) {
        if (sensor.format !== "metadata") continue;
        await axios
          .get(import.meta.env.VITE_API_URL + "/data/csv/" + sensor.name)
          .then((res) => {
            const jsonData = Papa.parse(res.data, { header: true }).data;
            const datarow: any = jsonData[jsonData.length - 1]
              ? jsonData[jsonData.length - 1]
              : jsonData[jsonData.length - 2];
            setLastBatteryFraction(datarow["last_battery_fraction"] / 100);
            setLastSurfaceTime(+datarow["last_surface_time"]);
            setLastServiceTime(+datarow["last_serviced_time"]);
          });
      }
    };
    fetchMetaData();
  }, [buoy.name]);

  return (
    <div className='moduleContent'>
      <div className='healthModule'>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h2 style={{ position: "absolute", left: 0, top: 0, margin: 12 }}>
            Health
          </h2>
          <h3 style={{ position: "absolute", right: 0, top: 0, margin: 12 }}>
            Last surface time:{" "}
            {lastSurfaceTime
              ? new Date(lastSurfaceTime * 1000).toLocaleString()
              : "No data"}
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ margin: 32 }}>
            <p>
              Buoy last serviced:{" "}
              {lastServiceTime
                ? new Date(lastServiceTime * 1000).toLocaleString()
                : "No data"}
            </p>
          </div>
          <div>
            <div style={{ fontSize: 14, margin: 32 }}>
              {buoy.warnings.map((m) => (
                <div>
                  <br />
                  <b>{m.name}</b>
                  <ul style={{ margin: 0 }}>
                    <li style={{ margin: 0 }}>
                      {m.diffs.length
                        ? "Sudden changes - See red boxes in graph"
                        : ""}
                    </li>
                    <li style={{ margin: 0 }}>
                      {m.rows.length ? "Deviating values detected" : ""}
                    </li>
                    <li style={{ margin: 0 }}>
                      {m.warning.length ? "Outside warning thresholds" : ""}
                    </li>
                    <li style={{ margin: 0 }}>
                      {m.threshold.length ? "Outside limit thresholds" : ""}
                    </li>
                    <li style={{ margin: 0 }}>
                      {!(
                        m.threshold.length ||
                        m.warning.length ||
                        m.rows.length ||
                        m.diffs.length
                      )
                        ? "All ok!"
                        : ""}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: 60,
              position: "absolute",
              bottom: 0,
              left: 0,
              marginBottom: 10,
              backgroundColor: "rgba(100, 30, 0, 0.05)",
            }}
          >
            <div
              style={{
                backgroundColor: "green",
                width: lastBatteryFraction
                  ? 100 * lastBatteryFraction + "%"
                  : "100%",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  textAlign: "center",
                  color: "white",
                  textShadow: "0px 0px 2px black",
                }}
              >
                {lastBatteryFraction
                  ? lastBatteryFraction * 100 + "%"
                  : "No battery data"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthModule;
