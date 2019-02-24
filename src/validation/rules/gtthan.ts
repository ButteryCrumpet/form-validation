



type greaterThan = (min: number) => (str: string) => boolean;
export const greaterThan: greaterThan = min => str =>
  {
    const asNumber = Number(str);
    return isNaN(asNumber) ? false : asNumber > min;
  };
