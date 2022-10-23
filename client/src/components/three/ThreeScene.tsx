import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import BuoyModel from "./BuoyModel";
import Ocean from "./Ocean";
import { OrbitControls, Sky } from "@react-three/drei";
import { Buoy, Metadata } from "../../types";
import axios from "axios";
import Papa from "papaparse";

function ThreeScene({ buoy }: { buoy: Buoy }) {
  const [submerged, setSubmerged] = useState(false);

  const submergedCameraHeight = 0;
  const submergedBuoyHeight = -2;
  const surfacedCameraHeight = 2;
  const surfacedBuoyHeight = -0.135;

  const cameraHeight = (submerged: boolean) =>
    submerged ? submergedCameraHeight : surfacedCameraHeight;
  const buoyHeight = (submerged: boolean) =>
    submerged ? submergedBuoyHeight : surfacedBuoyHeight;

  const dateDiffInHours = (a: Date, b: Date) => {
    const _MS_PER_HOUR = 1000 * 60 * 60;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_HOUR);
  };

  useEffect(() => {
    const sensor = buoy.sensors.find((sensor) => sensor.format === "metadata");
    if (!sensor) return;
    axios
      .get(import.meta.env.VITE_API_URL + "/data/csv/" + sensor.name)
      .then((res) => {
        const jsonData = Papa.parse(res.data, {
          header: true,
        }).data as Metadata[];
        const lastSurfaceTime = Math.max(
          ...jsonData.map((metadata) => metadata.last_surface_time)
        );
        console.log(lastSurfaceTime);

        const lastSurfaceTimeDate = new Date(lastSurfaceTime * 1000);
        const diff = dateDiffInHours(lastSurfaceTimeDate, new Date());
        setSubmerged(diff > 3);
      });
  }, [buoy.name]);

  return (
    <>
      {submerged ? (
        <div
          style={{
            zIndex: 300,
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <img
            style={{ opacity: 0.7, width: "100%", height: "100%" }}
            src='/underwater.jpeg'
          ></img>
        </div>
      ) : (
        <div
          style={{
            zIndex: 300,
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        ></div>
      )}
      <Canvas
        style={{ height: "100%", borderRadius: "0.5em" }}
        camera={{
          position: [0, cameraHeight(submerged), 10],
          fov: 55,
          near: 1,
          far: 20000,
        }}
      >
        <pointLight position={[100, 150, -100]} intensity={0.4} />
        <Suspense fallback={null}>
          <Ocean />
          <BuoyModel
            buoyHeight={buoyHeight(submerged)}
            submerged={submerged}
            cameraHeight={cameraHeight(submerged)}
          />
        </Suspense>
        <Sky sunPosition={[500, 150, -1000]} turbidity={0.5} />
        {/* <OrbitControls /> */}
      </Canvas>
    </>
  );
}

export default ThreeScene;
