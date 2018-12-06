
export type Result<T, E> = Ok<T> | Err<E>

interface Ok<T> {
  type: "ok",
  value: T
}

interface Err<E> {
  type: "err",
  value: E
}

type makeErr = <T>(message: T) => Err<T>
export const Err: makeErr
  = message => ({ type: "err", value: message })

type makeOk = <T>(value: T) => Ok<T>
export const Ok: makeOk
 = value => ({ type: "ok", value: value })

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.type === "ok"
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.type === "err"
}

type map = <U, T, E>(fn: (val: T) => U) => (result: Result<T, E>) => Result<U, E>
export const map: map
  = fn => result => isOk(result) ? Ok(fn(result.value)) : result 
    
type mapErr = <U, T, E>(fn: (val: E) => U) => (result: Result<T, E>) => Result<T, U>
export const mapErr: mapErr
  = fn => result => isErr(result) ? Err(fn(result.value)) : result 

type andThen = <U, T, E>(fn: (val: T) => Result<U, E>) => (result: Result<T, E>) => Result<U, E>
export const andThen: andThen
  = fn => result => isOk(result) ? fn(result.value) : result
