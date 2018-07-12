export interface Config {
  messages?: StringMap
  prettyNames?: StringMap
}

export interface Field {
  name: string
  value: string
  validator: Function
  errors: ReadonlyArray<string>
}

export type State = ReadonlyArray<Field>

export interface StringMap { [key: string]: string; }

export type Result = Ok | Err

export interface Ok {
  value: string
}

export interface Err {
  message: string
}

export interface RuleConfig {
  name: string
  args?: any
}

export interface Rule {
  name: string
  fn: Function
}

export type Validator = (data: string) => ReadonlyArray<string>
export type ResultRule = (data: string) => Result


export interface Parsed {
  name: string
  args?: any
}