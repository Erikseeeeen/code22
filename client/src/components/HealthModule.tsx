import { Buoy, Module, Sensor, Warning } from "../types";
import "./ModuleContent.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import "./HealthModule.css";
import { formatName, formatWarningName } from "../utils";

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

  const isOk = (w: Warning) =>
    !(
      w.threshold.length ||
      w.warning.length ||
      w.rows.length ||
      w.diffs.length
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
        <div>
          <h2 style={{ position: "absolute", left: 0, top: 0, margin: "1em" }}>
            Health
          </h2>
          <p style={{ margin: 0, marginTop: "20pt" }}>
            Last surface time:{" "}
            {lastSurfaceTime
              ? new Date(lastSurfaceTime * 1000).toLocaleString()
              : "No data"}
          </p>
          <p style={{ margin: 0 }}>
            Buoy last serviced:{" "}
            {lastServiceTime
              ? new Date(lastServiceTime * 1000).toLocaleString()
              : "No data"}
          </p>
        </div>
        <div>
          <div style={{ fontSize: 14, margin: 0 }}>
            {buoy.warnings.map((w) => (
              <div>
                <br />
                <b style={{ color: isOk(w) ? "var(--green)" : "var(--red)" }}>
                  {formatWarningName(w.name, buoy)}
                </b>
                <ul>
                  <li>
                    {w.diffs.length
                      ? "Sudden changes - See red boxes in graph"
                      : ""}
                  </li>
                  <li>{w.rows.length ? "Deviating values detected" : ""}</li>
                  <li>
                    {w.warning.length ? "Outside warning thresholds" : ""}
                  </li>
                  <li>
                    {w.threshold.length ? "Outside limit thresholds" : ""}
                  </li>
                  <li>{isOk(w) ? "All ok!" : ""}</li>
                </ul>
              </div>
            ))}
          </div>
          <div
            style={{
              width: "100%",
              height: 60,
              position: "absolute",
              bottom: 0,
              left: 0,
              marginBottom: 0,
              backgroundColor: "rgba(100, 30, 0, 0.05)",
            }}
          >
            <div
              style={{
                backgroundColor: lastBatteryFraction
                  ? lastBatteryFraction > 0.25
                    ? "var(--green)"
                    : "var(--red)"
                  : "grey",
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
                  // textShadow: '0px 0px 2px black',
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
