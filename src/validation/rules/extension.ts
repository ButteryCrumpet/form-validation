



type extension = (extensions: string[]) => (str: string) => boolean;
export const extension: extension = exts => str =>
  {
    const split = str.split(".");
    return exts.indexOf(split[split.length - 1]) !== -1;

  };