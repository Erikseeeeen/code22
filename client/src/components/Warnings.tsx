import { useEffect, useContext } from "react";
import { AppContext } from "../context";
import { BuoySimple, Status } from "../types";
import { useNavigate } from "react-router-dom";
import "./warnings.css";
import { formatName } from "../utils";

function WarningItem({ buoy }: { buoy: BuoySimple }) {
  const color = ["green", "orange", "red"][buoy.status];
  const navigate = useNavigate();

  return (
    <div
      className={"warning-item " + color}
      onClick={() => navigate(`/buoy/${buoy.name}`)}
    >
      <div>
        <strong>{formatName(buoy.name)}</strong>
      </div>
      <div className="sensor-warnings">
        <div>
          <strong>Sensors:</strong>
        </div>
        <ul>
          {buoy.warnings.map((warning, i) => (
            <li key={i}>{formatName(warning.name)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Warnings() {
  const context = useContext(AppContext);

  return (
    <div className="warning-container">
      {context.buoys.value
        .filter((buoy) => buoy.status !== 0)
        .sort((a, b) => a.status - b.status)
        .map((buoy, i) => {
          return <WarningItem key={i} buoy={buoy} />;
        })}
    </div>
  );
}

export default Warnings;
