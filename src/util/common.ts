export const titleCase = (str: string): string => {
  return str.split('')[0].toUpperCase() + str.slice(1);
};
