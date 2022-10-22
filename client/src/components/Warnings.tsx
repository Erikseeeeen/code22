import { useEffect, useContext } from "react";
import { AppContext } from "../context";
import { BuoySimple, Status } from "../types";
import { useNavigate } from "react-router-dom";
import "./warnings.css";
import { formatName } from "../utils";

function WarningItem({ buoy }: { buoy: BuoySimple }) {
  const navigate = useNavigate();
  const color = ["green", "orange", "red"][buoy.status];

  return (
    <div
      className="warning-item-container"
      onClick={() => navigate(`/buoy/${buoy.name}`)}
    >
      <div className="circle-container">
        <div className={"circle " + color}></div>
      </div>
      <div className={"warning-item"}>
        <div>
          <strong>{formatName(buoy.name)}</strong>
        </div>
        {buoy.warnings.length > 0 && (
          <div className="sensor-warnings">
            <div>
              <strong>Warnings:</strong>
            </div>
            <ul>
              {buoy.warnings.map((warning, i) => (
                <li key={i}>{formatName(warning.name)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Warnings() {
  const context = useContext(AppContext);

  return (
    <div className="warning-container">
      {context.buoys.value
        .sort((a, b) => b.status - a.status)
        .map((buoy, i) => {
          return <WarningItem key={i} buoy={buoy} />;
        })}
    </div>
  );
}

export default Warnings;
