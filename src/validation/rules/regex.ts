



type regex = (regex: RegExp) => (str: string) => boolean;
export const regex: regex = regex => str => regex.test(str);