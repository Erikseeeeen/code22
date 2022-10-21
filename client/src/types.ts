export enum ModuleType {
  None,
  Three,
  Map,
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
  format: 'csv' | 'mp4';
  timestamp: string;
};

export type BuoySimple = {
  name: string;
  status: Status;
  location: {
    lat: number;
    long: number;
  };
  warnings: string[];
};

export type Buoy = {
  name: string;
  status: Status;
  location: {
    lat: number;
    long: number;
  };
  warnings: string[];
  sensors: Sensor[];
};
