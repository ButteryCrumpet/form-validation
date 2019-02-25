import { required } from "../form/field";

export interface RuleConfig {
  name: string;
  args: string[];
}


export interface RuleList {
  [key: string]: RuleFactory;
}


export interface Context {
  [key: string]: string;
}


export type Validator = (data: string, context?: Context) => string[];


type RuleFactory = (...args: string[]) => Rule;


type Rule = (data: string, context?: Context) => boolean;


type factory = (rules: RuleList) => (config: ReadonlyArray<RuleConfig>, required: boolean) => Validator;
export const factory: factory = rules => (config, required) =>
  {
    const validators = config.map(buildRule(rules));

    return (data, context) => {
      
      if (!required && data === "") {
        return [];
      }

      if (required && data === "") {
        return ["required"];
      }
      
      return validators
        .reduce((errs: string[], [name, fn]) => fn(data, context) ? errs : errs.concat([name]), []);
    };
  };


type ruleBuilder = (rules: RuleList) => (conf: RuleConfig) => [string, Rule];
const buildRule: ruleBuilder = rules => conf =>
  {
    if (!rules.hasOwnProperty(conf.name)) {
      throw new Error(`A validator with the name "${conf.name}" does not exist`);
    }
    return [conf.name, rules[conf.name](...conf.args)];
  };
