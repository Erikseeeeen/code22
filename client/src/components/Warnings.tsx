import { useEffect, useContext } from "react";
import { AppContext } from "../context";
import { BuoySimple, Status } from "../types";
import { useNavigate } from "react-router-dom";
import "./warnings.css";

function WarningItem({ buoy }: { buoy: BuoySimple }) {
  const color = ["green", "orange", "red"][buoy.status];
  const navigate = useNavigate();

  return (
    <div
      className={"warning-item " + color}
      onClick={() => navigate(`/buoy/${buoy.name}`)}
    >
      <div>{buoy.name.replace("_", " ")}</div>
      <ul>
        {buoy.warnings.map((warning, i) => (
          <li key={i}>{warning.replaceAll("_", " ")}</li>
        ))}
      </ul>
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
