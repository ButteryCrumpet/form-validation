



type numeric = (str: string) => boolean;
export const numeric: numeric = str => !isNaN(Number(str));