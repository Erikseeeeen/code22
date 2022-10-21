import { useContext, useEffect } from "react";
import Map from "../components/Map";
import { AppContext } from "../context";
import axios from "axios";

function Links() {
  const context = useContext(AppContext);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + "/buoys").then((res) => {
      context.buoys.set(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Overview</h1>
      <Map />
    </div>
  );
}

export default Links;
