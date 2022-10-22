import axios from "axios";
import { useContext, useEffect } from "react";
import { AppContext } from "../context";
import { Buoy } from "../types";

const Wrapper = ({children}: {children: JSX.Element}) => {
    const context = useContext(AppContext);
    useEffect(() => {
        axios.get(import.meta.env.VITE_API_URL + "/buoys").then((res) => {
            const x = res.data;
            x.sort((a : Buoy, b : Buoy) => b.status - a.status)
            context.buoys.set(x);
        });
    }, []);

  return (<>{children}</>)
}

export default Wrapper;
