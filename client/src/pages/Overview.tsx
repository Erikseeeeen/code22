import { useContext, useEffect } from "react";
import Map from "../components/Map";
import Warnings from "../components/Warnings";
import { AppContext } from "../context";
import axios from "axios";
import "./Overview.css";
import Loading from "../components/Loading";

function Links() {
  const context = useContext(AppContext);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + "/buoys").then((res) => {
      context.buoys.set(res.data);
    });
  }, []);

  if (!context.buoys.value) return <Loading />;
  return (
    <div className="overview-container">
      <h1>Overview</h1>
      <Map />
      <Warnings />
    </div>
  );
}

export default Links;
