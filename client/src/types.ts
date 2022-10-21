export type Module = {
  id: number;
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

export type BuoySimple = {
  id: number;
  status: Status;
  location: {
    lat: number;
    long: number;
  };
  warnings: string[];
};
