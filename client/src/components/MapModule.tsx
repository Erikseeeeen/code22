import { Buoy, BuoyPosition } from "../types";
import "./ModuleContent.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import BuoyMap from "./BuoyMap";
import Loading from "./Loading";

function MapModule({ buoy }: { buoy: Buoy }) {
  const [buoyPositions, setBuoyPositions] = useState<BuoyPosition[]>([]);

  useEffect(() => {
    const fetchMetaData = async () => {
      const positions: BuoyPosition[] = [];
      for (const sensor of buoy.sensors) {
        if (sensor.format !== "metadata") continue;
        await axios
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
          });
      }
      setBuoyPositions(positions);
    };
    fetchMetaData();
  }, [buoy.name]);

  if (buoyPositions.length === 0) {
    return <Loading />;
  }
  return (
    <div className="moduleContent">
      <BuoyMap positions={buoyPositions} />
    </div>
  );
}

export default MapModule;
