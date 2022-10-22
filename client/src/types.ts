export enum ModuleType {
  None,
  Three,
  Chart,
  Map,
  Video,
}

export type Module = {
  id: number;
  type: ModuleType;
};

export type Row = {
  id: number;
  modules: Module[];
};

export enum Status {
  green,
  yellow,
  red,
}

export type Sensor = {
  name: string;
  threshold_low: number;
  threshold_high: number;
  format: "csv" | "mp4" | "gps";
  timestamp: string;
};

export type Warning = {
  name: string;
  rows: number[];
  diffs: number[];
  threshold: number[];
};

export type BuoySimple = {
  name: string;
  status: Status;
  anchor: {
    lat: number;
    long: number;
  };
  warnings: Warning[];
};

export type Buoy = {
  name: string;
  status: Status;
  anchor: {
    lat: number;
    long: number;
  };
  warnings: Warning[];
  sensors: Sensor[];
};

export type AppContextType = {
  rows: { value: Row[]; set: any };
  buoys: { value: BuoySimple[]; set: any };
};

export type LatLong = {
  lat: number;
  long: number;
};

export type BuoyPosition = {
  timestamp: number;
  coordinate: LatLong;
};

export type Plot = {
  x: number[];
  y: number[];
  headers: string[];
};

export type RgbColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};
