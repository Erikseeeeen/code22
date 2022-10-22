import { Buoy, Module, ModuleType, Plot } from '../types';
import './ModuleContent.css';
import Three from './three/Three';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { LinePlot } from './Line';
import Loading from './Loading';

function VideoModule({ module, buoy }: { module: Module; buoy: Buoy }) {

  const [video, setVideo] = useState("");
  
    useEffect(() => {
        for (const sensor of buoy.sensors) {
            if (sensor.format == "mp4") {
                axios.get<Blob>(import.meta.env.VITE_API_URL + '/data/video/' + sensor.name, {responseType: 'blob'}).then((res) => {
                const b = new Blob([res.data]);
                const url = URL.createObjectURL(b);
                setVideo(url);
                });
            }
        }
    }, []);

    return video ? (
        <div className="moduleContent">
            <video width="100%" height="100%" autoPlay loop key={video}>
            <source src={video} />
            </video>
        </div> 
    ) : <Loading />;
}

export default VideoModule;
