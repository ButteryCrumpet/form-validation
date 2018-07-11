import { any, all, filter } from "ramda"

const isTrue = (val: any) => val ? true : false
const isFalse = (val: any) => val ? false : true

export const or: (arr: ReadonlyArray<boolean>) => boolean =
  arr => any(isTrue, arr)

export const and: (arr: ReadonlyArray<boolean>) => boolean =
  arr => all(isTrue, arr)

const countTrue: (arr: ReadonlyArray<boolean>) => number =
  arr => (filter(isTrue, arr)).length
export const nTrue: (n: number) => (arr: ReadonlyArray<boolean>) => boolean =
  n => arr => countTrue(arr) === n
export const minTrue: (n: number) => (arr: ReadonlyArray<boolean>) => boolean =
  n => arr => countTrue(arr) >= n
export const maxTrue: (n: number) => (arr: ReadonlyArray<boolean>) => boolean =
  n => arr => countTrue(arr) <= n

const countFalse: (arr: ReadonlyArray<boolean>) => number =
  arr => (filter(isFalse, arr)).length
export const nFalse: (n: number) => (arr: ReadonlyArray<boolean>) => boolean =
  n => arr => countFalse(arr) === n
export const minFalse: (n: number) => (arr: ReadonlyArray<boolean>) => boolean =
  n => arr => countFalse(arr) >= n
export const maxFalse: (n: number) => (arr: ReadonlyArray<boolean>) => boolean =
  n => arr => countFalse(arr) <= n
