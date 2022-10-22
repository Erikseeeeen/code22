import React from "react";
import { AppContextType } from "./types";

export const AppContext = React.createContext<AppContextType>(
  {} as AppContextType
);
