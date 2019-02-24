



type blacklist = (arr: string[]) => (str: string) => boolean;
export const blacklist: blacklist = arr => str => arr.indexOf(str) === -1;