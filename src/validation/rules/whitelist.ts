



type whitelist = (arr: string[]) => (str: string) => boolean;
export const whitelist: whitelist = arr => str => arr.indexOf(str) !== -1;