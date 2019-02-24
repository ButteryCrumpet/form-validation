



type minLength = (min: number) => (x: string) => boolean;
export const minLength: minLength = min => x => x.length >= min;