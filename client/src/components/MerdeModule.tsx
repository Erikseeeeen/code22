import { Buoy, Module, Sensor, Warning } from "../types";
import "./ModuleContent.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import "./MerdeModule.css";
import { formatName } from "../utils";

function MerdeModule({ module, buoy }: { module: Module; buoy: Buoy }) {
  const [pH, setPH] = useState<number | undefined>(undefined);
  const [liceStatus, setLiceStatus] = useState<number | undefined>(undefined);
  const [fishMass, setFishMass] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchMerdeData = async () => {
      for (const sensor of buoy.sensors) {
        if (sensor.format !== "merde") continue;
        await axios
          .get(import.meta.env.VITE_API_URL + "/data/csv/" + sensor.name)
          .then((res) => {
            const jsonData = Papa.parse(res.data, { header: true }).data;
            const datarow: any = jsonData[jsonData.length - 1]
              ? jsonData[jsonData.length - 1]
              : jsonData[jsonData.length - 2];
            setPH(datarow["pH"]);
            setFishMass(datarow["fish_mass"]);
            setLiceStatus(datarow["lice_status"]);
          });
      }
    };
    fetchMerdeData();
  }, [buoy.name]);

  return (
    <div className='moduleContent'>
      <div className='merdeModule'>
        <div>
          <h2 style={{ position: "absolute", left: 0, top: 0, margin: "1em" }}>
            Fish status
          </h2>
          <p style={{ margin: 0, marginTop: "20pt" }}>
            Average fish mass: {fishMass}kg
          </p>
          <p style={{ margin: 0 }}>Current lice prevelance: {liceStatus}</p>
          <p style={{ margin: 0 }}>pH value: {pH}</p>
          <img src='/salmon.png' width='100%' style={{ marginTop: 40 }} />
        </div>
      </div>
    </div>
  );
}

export default MerdeModule;
