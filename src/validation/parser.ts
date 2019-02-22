
export interface Parsed {
  name: string;
  args: string[];
}

type parse = (str: string, ruleSep?: string, argSep?: string) => ReadonlyArray<Parsed>;
export const parse: parse = (str, ruleSep = "|", argSep = ":") =>
  str.split(ruleSep)
    .map(s => s.split(argSep))
    .map(toRuleConfig);


type toRuleConfig = (arr: ReadonlyArray<string>) => Parsed;
const toRuleConfig: toRuleConfig = ([name, args]) =>
  ({ name, args: args ? args.split(",") : [] });
