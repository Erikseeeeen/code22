import { Buoy, Module } from "../types";
import "./ModuleContent.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";

function VideoModule({ module, buoy }: { module: Module; buoy: Buoy }) {
  const [video, setVideo] = useState("");

  useEffect(() => {
    const video_sensor = buoy.sensors.find((s) => s.format == "mp4");
    if (video_sensor) {
      axios
        .get<Blob>(
          import.meta.env.VITE_API_URL + "/data/video/" + video_sensor.name,
          { responseType: "blob" }
        )
        .then((res) => {
          const b = new Blob([res.data]);
          setVideo(URL.createObjectURL(b));
        });
    } else {
      setVideo("");
    }
  }, [buoy.name]);

  return video ? (
    <div className="moduleContent" style={{ backgroundColor: "black" }}>
      <video width="100%" height="100%" autoPlay loop key={video}>
        <source src={video} />
      </video>
    </div>
  ) : (
    <Loading />
  );
}

export default VideoModule;
