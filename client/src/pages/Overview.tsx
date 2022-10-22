import { useContext, useEffect } from "react";
import Map from "../components/Map";
import Warnings from "../components/Warnings";
import { AppContext } from "../context";
import axios from "axios";
import "./Overview.css";
import Loading from "../components/Loading";

function Overview() {
  const context = useContext(AppContext);


  if (!context.buoys.value) return <Loading />;
  return (
    <div className="overview-container">
      <Map />
      <h1>Overview</h1>
      <Warnings />
    </div>
  );
}

export default Overview;
