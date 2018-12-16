
export type Maybe<T> = Some<T> | None

type Some<T> = [true, T]
type None = [false, null]

type makeSome = <T>(value: T) => Some<T>
export const Some: makeSome
  = value => [true, value]

type makeNone = () => None
export const None: makeNone
  = () => [false, null]

export const isSome = <T>(maybe: Maybe<T>): maybe is Some<T> => maybe[0]
export const isNone = <T>(maybe: Maybe<T>): maybe is None => !maybe[0]

type map = <T, U>(fn: (value: T) => U) => (maybe: Maybe<T>) => Maybe<U>
export const map: map
  = fn => maybe => isSome(maybe) ? Some(fn(maybe[1])) : maybe

type andThen = <T, U>(fn: (value: T) => Maybe<U>) => (maybe: Maybe<T>) => Maybe<U>
export const andThen: andThen
  = fn => maybe => isSome(maybe) ? fn(maybe[1]) : maybe

type withDefault = <T>(fallback: T) => (maybe: Maybe<T>) => T
export const withDefault: withDefault
  = fallback => maybe => isSome(maybe) ? maybe[1] : fallback

type unwrap = <T>(some: Some<T>) => T
export const unwrap: unwrap
  = some => some[1]