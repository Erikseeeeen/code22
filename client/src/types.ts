export enum ModuleType {
  None,
  Three,
  Chart,
  Map,
  Video,
  Health,
  Merde,
  Sonar,
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
  limit_low: number;
  limit_high: number;
  recommended_low: number;
  recommended_high: number;
  format: 'csv' | 'mp4' | 'gps' | 'metadata' | 'merde';
  timestamp: string;
};

export type Warning = {
  name: string;
  rows: number[];
  diffs: number[];
  threshold: number[];
  warning: number[];
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

export type FetchRequest = 'buoys' | '';

export type AppContextType = {
  rows: { value: Row[]; set: any };
  buoys: { value: BuoySimple[]; set: any };
  projects: { value: Project[]; set: any };
  project: { value: Project | null; set: any };
  fetchRequest: { value: FetchRequest; set: (fr: FetchRequest) => void };
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
  color: RgbColor;
  limLow: number;
  limHigh: number;
  recommendedLow: number;
  recommendedHigh: number;
  from: Date;
  to: Date;
  diffs?: number[];
};

export type RgbColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type Metadata = {
  timestamp: number;
  lat: number;
  long: number;
  lastSurfaceTime: number;
};

export type Project = {
  name: string;
  buoyNames: string[];
  preset: string;
};
