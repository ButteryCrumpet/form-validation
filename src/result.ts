
export type Result<T, E> = Ok<T> | Err<E>

interface Ok<T> {
  type: "ok",
  value: T
}

interface Err<E> {
  type: "err",
  value: E
}

export const Err: <T>(message: T) => Err<T>
  = message => ({ type: "err", value: message })

export const Ok: <T>(value: T) => Ok<T>
 = value => ({ type: "ok", value: value })

 export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.type === "ok"
 }

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.type === "err"
}

type map = <U, T, E>(fn: (val: T) => U) => (result: Result<T, E>) => Result<U, E>
export const map: map
  = fn => result => {
    if (isErr(result)) {
       return result
    }
    return Ok(fn(result.value))
  }

type mapErr = <U, T, E>(fn: (val: E) => U) => (result: Result<T, E>) => Result<T, U>
export const mapErr: mapErr
  = fn => result => {
    if (isOk(result)) {
       return result
    }
    return Err(fn(result.value))
  }

type andThen = <U, T, E>(fn: (val: T) => Result<U, E>) => (result: Result<T, E>) => Result<U, E>
export const andThen: andThen
  = fn => result => {
    if (isErr(result)) {
      return result;
    }
    return fn(result.value)
  }