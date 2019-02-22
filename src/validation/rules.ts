import { isEmpty, any, last, test, defaultTo, split } from "ramda";

// existence
export const exists: (x: any) => boolean =
  x => x != null;
export const notEmpty: (x: any) => boolean =
  x => !isEmpty(x);
export const existsAndFilled: (x: any) => boolean =
  x => exists(x) && notEmpty(x);

// regex
export const regex = test;

// types
export const digits: (x: any) => boolean =
  x => !isNaN(x);

// > <
export const greaterThan: (max: number) => (x: string) => boolean =
  max => x => parseFloat(x) > max;
export const lessThan: (max: number) => (x: string) => boolean =
  min => x => parseFloat(x) < min;

// whitelist/blacklist
export const blacklist: (arr: ReadonlyArray<string>) => (x: string) => boolean =
  arr => x => !whitelist(arr)(x);
export const whitelist: (arr: ReadonlyArray<string>) => (x: string) => boolean =
  arr => x => any(y => y === x, arr);

// length
export const minLength: (min: number) => (x: string) => boolean =
  min => x => x.length >= min;
export const maxLength: (max: number) => (x: string) => boolean =
  max => x => x.length <= max;

// file extension validation
const defaultToEmptyString = defaultTo("");
const splitAtDot = split(".");
const getExt = fname => defaultToEmptyString(last(splitAtDot(fname)));
export const extensions: (extensions: ReadonlyArray<string>) => (file: string) => boolean =
  extensions => file => whitelist(extensions)(getExt(file));
