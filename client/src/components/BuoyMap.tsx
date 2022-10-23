import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  ScaleControl,
  Polyline,
  Circle,
} from "react-leaflet";

import { BuoyPosition, LatLong } from "../types";
import * as L from "leaflet";
import { useEffect, useState } from "react";

function BuoyMapMarkers({
  positions,
  anchor,
  radar,
}: {
  positions: BuoyPosition[];
  anchor?: LatLong;
  radar: boolean;
}) {
  const map = useMap();
  console.log(positions);

  const coordinatesList: L.LatLngExpression[] = [];
  positions.forEach((pos) => {
    coordinatesList.push([pos.coordinate.lat, pos.coordinate.long]);
  });
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

  const icon = () =>
    L.divIcon({
      iconAnchor: [0, 24],
      popupAnchor: [3, -36],
      html: `<span class="green" style="${markerHtmlStyles()}" />`,
    });

  useEffect(() => {
    let lat: number = 0;
    let long: number = 0;
    if (radar) {
      lat = anchor!.lat;
      long = anchor!.long;
    } else {
      positions.forEach((pos) => {
        lat += Number(pos.coordinate.lat);
        long += Number(pos.coordinate.long);
      });
      lat = lat / positions.length;
      long = long / positions.length;
    }
    console.log(lat, long);

    if (positions) {
      map.setView([lat, long], radar ? 17 : 12);
    }
  }, [positions]);

  return (
    <div>
      {positions.map((pos, i) => (
        <Marker
          icon={icon()}
          position={[pos.coordinate.lat, pos.coordinate.long]}
          key={i}
        >
          <Popup>
            <h3>{new Date(pos.timestamp * 1000).toLocaleString()}</h3>
            <p>
              Surfaced at
              <br />
              Lat: {pos.coordinate.lat}
              <br />
              Long: {pos.coordinate.long}
            </p>
          </Popup>
        </Marker>
      ))}
      <Polyline positions={coordinatesList} />
      {radar && (
        <>
          {[1, 2, 3, 4].map((i) => {
            return (
              <Circle
                key={i}
                center={[anchor!.lat, anchor!.long]}
                radius={i * 25}
                color={i % 2 === 0 ? "blue" : "red"}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

function BuoyMap({
  positions,
  anchor,
  radar,
}: {
  positions: BuoyPosition[];
  anchor?: LatLong;
  radar: boolean;
}) {
  return (
    <MapContainer
      //center={[positions[0].coordinate.lat, positions[0].coordinate.long]}
      zoom={12}
      scrollWheelZoom={true}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0.5em",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ScaleControl />
      <BuoyMapMarkers
        positions={positions.reverse().slice(0, Math.min(10, positions.length))}
        anchor={anchor ? anchor : undefined}
        radar={radar}
      />
    </MapContainer>
  );
}

export default BuoyMap;
