



type lessThan = (max: number) => (str: string) => boolean;
export const lessThan: lessThan = max => str =>
  {
    const asNumber = Number(str);
    return isNaN(asNumber) ? false : asNumber < max;
  };