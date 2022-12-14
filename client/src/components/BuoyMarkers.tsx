import { Marker, Popup, useMap } from "react-leaflet";
import { useContext, useEffect } from "react";
import { Status } from "../types";
import * as L from "leaflet";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context";
import { formatName } from "../utils";

function BuoyMarkers() {
  const context = useContext(AppContext);
  const map = useMap();
  const navigate = useNavigate();
  const getStatusColor = (status: Status) => ["green", "orange", "red"][status];

  const markerHtmlStyles = () => `
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1rem;
    top: -1rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF;`;

  const icon = (status: Status) =>
    L.divIcon({
      iconAnchor: [0, 24],
      popupAnchor: [3, -36],
      html: `<span class="${getStatusColor(
        status
      )}" style="${markerHtmlStyles()}" />`,
    });

  useEffect(() => {
    if (context.buoys.value.length > 0) {
      map.setView(
        [
          context.buoys.value[0].anchor.lat,
          context.buoys.value[0].anchor.long,
        ],
        6
      );
    }
  }, [context.buoys.value]);

  return (
    <div>
      {context.buoys.value.map((buoy) => (
        <Marker
          icon={icon(buoy.status)}
          position={[buoy.anchor.lat, buoy.anchor.long]}
          key={buoy.name}
        >
          <Popup>
            <h3>{formatName(buoy.name)}</h3>
            <p>
              Lat: {buoy.anchor.lat}
              <br />
              Long: {buoy.anchor.long}
              <br />
              <br />
              Status: <strong>{["Ok", "Warning", "Error"][buoy.status]}</strong>
            </p>
            <button onClick={() => navigate(`/buoy/${buoy.name}`)}>View</button>
          </Popup>
        </Marker>
      ))}
    </div>
  );
}

export default BuoyMarkers;
