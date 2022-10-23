import { BuoySimple } from './types';

export const formatName = (name: string) => {
  return name[0].toUpperCase() + name.slice(1).replaceAll('_', ' ');
};

export const formatWarningName = (name: string, buoy: BuoySimple) => {
  name = name.substring(buoy.name.length + 1).trim();
  if (name.length < 2) return '';
  return name[0].toUpperCase() + name.slice(1).replaceAll('_', ' ');
};
