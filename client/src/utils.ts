export const formatName = (name: string) => {
  return name[0].toUpperCase() + name.slice(1).replaceAll("_", " ");
};
