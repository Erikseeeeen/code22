import { MapContainer, TileLayer } from 'react-leaflet';
import BuoyMarkers from './BuoyMarkers';

function Map() {
  return (
    <MapContainer
      center={[61.505, 0]}
      zoom={5}
      scrollWheelZoom={true}
      style={{ width: '100vw', height: '40vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BuoyMarkers />
    </MapContainer>
  );
}

export default Map;
