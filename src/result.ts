
export type Result<T, E> = Ok<T> | Err<E>

type Ok<T> = ["ok", T]

type Err<E> = ["err", E]

type makeErr = <T>(message: T) => Err<T>
export const Err: makeErr
  = message => ["err", message]

type makeOk = <T>(value: T) => Ok<T>
export const Ok: makeOk
 = value => ["ok", value]

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result[0] === "ok"
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result[0] === "err"
}

type map = <U, T, E>(fn: (val: T) => U) => (result: Result<T, E>) => Result<U, E>
export const map: map
  = fn => result => isOk(result) ? Ok(fn(result[1])) : result 
    
type mapErr = <U, T, E>(fn: (val: E) => U) => (result: Result<T, E>) => Result<T, U>
export const mapErr: mapErr
  = fn => result => isErr(result) ? Err(fn(result[1])) : result 

type andThen = <U, T, E>(fn: (val: T) => Result<U, E>) => (result: Result<T, E>) => Result<U, E>
export const andThen: andThen
  = fn => result => isOk(result) ? fn(result[1]) : result
