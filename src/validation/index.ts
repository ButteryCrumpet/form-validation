import { Validator, factory } from "./factory";
import { ruleFactories } from "./default-validator-conf";
import { parse } from "./parser";


const _factory = factory(ruleFactories);

export type Validator = Validator;

export type ValidationFactory = (str: string, required: boolean) => Validator;
export const validationFactory: ValidationFactory = (str, required) =>
  {
    return _factory(parse(str), required);
  };