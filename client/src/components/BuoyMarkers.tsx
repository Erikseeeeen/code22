import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BuoySimple } from '../types';

function BuoyMarkers() {
  const map = useMap();
  const [buoys, setBuoys] = useState<BuoySimple[]>([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/buoys').then((res) => {
      setBuoys(res.data);
      if (res.data.length > 0) {
        map.setView([res.data[0].location.lat, res.data[0].location.long], 6);
      }
    });
  }, []);

  return (
    <div>
      {buoys.map((buoy) => (
        <Marker
          position={[buoy.location.lat, buoy.location.long]}
          key={buoy.id}
        >
          <Popup>{JSON.stringify(buoy)}</Popup>
        </Marker>
      ))}
    </div>
  );
}

export default BuoyMarkers;
