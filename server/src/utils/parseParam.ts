
export const parseParam = (value?: string | string[]): string | undefined => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};