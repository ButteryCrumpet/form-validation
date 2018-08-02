import { map, has, find, pipe, filter } from "ramda";

interface RuleConfig {
  name: string
  args?: any
}
interface Rule {
  name: string
  fn: Function
}
type Validator = (data: string) => ReadonlyArray<string>
type ResultRule = (data: string) => Result
type Result = Ok | Err
interface Ok {
  value: string
}
interface Err {
  message: string
}

const wrapValidator: (func: Function, name: string) => ResultRule =
  (func, name) => data => {
    return func(data)
      ? {value: data}
      : {message: name}
  }

const hasArgs = has("args")
const build: (conf: RuleConfig, rule: Rule) => ResultRule =
  (conf, rule) => {
    return hasArgs(conf)
      ? wrapValidator(rule.fn(conf.args), conf.name)
      : wrapValidator(rule.fn, conf.name)
  }

const getValidator: (name: string, confArr: ReadonlyArray<Rule>) => Rule =
  (name, confArr) => {
    const f = find((c) => c.name === name, confArr)
    if (!f) {
      throw new Error(`A validator with the name "${name}" does not exist`)
    }
    return f;
  }

const builder: (rules: ReadonlyArray<Rule>, config: ReadonlyArray<RuleConfig>) => ReadonlyArray<ResultRule> =
  (rules, config) => map((c) => build(c, getValidator(c.name, rules)), config)
 
const isErr = (object: any): object is Err => 'message' in object
const filterErrors = (errors: ReadonlyArray<Result>) => filter(isErr)(errors)
const mapGetMessage = map((e: Err) => e.message)
const factory: (rules: ReadonlyArray<Rule>) => (config: ReadonlyArray<RuleConfig>) => Validator =
  rules => config => {
    return pipe(d => map((f) => f(d), builder(rules, config)), filterErrors, mapGetMessage)
  }
  
export default factory