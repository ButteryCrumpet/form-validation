import { RuleConfig } from "./factory";

type Parsed = RuleConfig;

type parse = (str: string, ruleSep?: string, argSep?: string) => ReadonlyArray<Parsed>;
export const parse: parse = (str, ruleSep = "|", argSep = ":") =>
  str.split(ruleSep)
    .filter(s => s !== "")
    .map(s => s.split(argSep))
    .map(toRuleConfig);


type toRuleConfig = (arr: ReadonlyArray<string>) => Parsed;
const toRuleConfig: toRuleConfig = ([name, args]) =>
  ({ name, args: args ? args.split(",") : [] });
