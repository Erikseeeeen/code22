import { Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BuoySimple, Status } from "../types";
import * as L from "leaflet";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context";

function BuoyMarkers() {
  const context = useContext(AppContext);
  const map = useMap();
  const navigate = useNavigate();
  const getStatusColor = (status: Status) => ["green", "orange", "red"][status];

  const markerHtmlStyles = (status: Status) => `
    background-color: ${getStatusColor(status)};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1rem;
    top: -1rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF`;

  const icon = (status: Status) =>
    L.divIcon({
      iconAnchor: [0, 24],
      popupAnchor: [3, -36],
      html: `<span style="${markerHtmlStyles(status)}" />`,
    });

  useEffect(() => {
    if (context.buoys.value.length > 0) {
      map.setView(
        [
          context.buoys.value[0].location.lat,
          context.buoys.value[0].location.long,
        ],
        6
      );
    }
  }, []);

  return (
    <div>
      {context.buoys.value.map((buoy) => (
        <Marker
          icon={icon(buoy.status)}
          position={[buoy.location.lat, buoy.location.long]}
          key={buoy.name}
        >
          <Popup>
            <h3>{buoy.name}</h3>
            <p>
              {buoy.location.lat}, {buoy.location.long}
              <br />
              Status: {["Ok", "Warning", "Error"][buoy.status]}
            </p>
            <button onClick={() => navigate(`/buoy/${buoy.name}`)}>View</button>
          </Popup>
        </Marker>
      ))}
    </div>
  );
}

export default BuoyMarkers;
