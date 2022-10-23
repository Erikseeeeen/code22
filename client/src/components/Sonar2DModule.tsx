import { Buoy, BuoyPosition } from "../types";
import "./ModuleContent.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import BuoyMap from "./BuoyMap";
import Loading from "./Loading";

function Sonar2DModule({ buoy }: { buoy: Buoy }) {
  const [buoyPositions, setBuoyPositions] = useState<BuoyPosition[]>([]);

  useEffect(() => {
    const fetchMetaData = async () => {
      console.log("start");
      const positions: BuoyPosition[] = [];
      for (const sensor of buoy.sensors) {
        console.log(sensor.format, sensor, sensor.name);
        if (sensor.format !== "gps") continue;
        axios
          .get(import.meta.env.VITE_API_URL + "/data/csv/" + sensor.name)
          .then((res) => {
            const jsonData = Papa.parse(res.data, { header: true }).data;
            jsonData.forEach((coord: any) => {
              const buoyPos: BuoyPosition = {
                timestamp: coord["timestamp"],
                coordinate: {
                  lat: coord["lat"],
                  long: coord["long"],
                },
              };
              positions.push(buoyPos);
            });
          })
          .then(() => setBuoyPositions(positions));
      }
    };
    fetchMetaData();
  }, [buoy.name]);

  if (buoyPositions.length === 0) {
    return <Loading />;
  }
  return (
    <div className='moduleContent'>
      <BuoyMap positions={buoyPositions} anchor={buoy.anchor} radar={true} />
    </div>
  );
}

export default Sonar2DModule;
