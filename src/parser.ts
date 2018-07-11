import { split, contains, map, length } from "ramda"
import { Parsed } from "./typings"

const toRuleConfig: (arr: ReadonlyArray<string>) => Parsed =
arr => length(arr) < 2 ? { name: arr[0] } : { name: arr[0], args: stringOrArray(arr[1]) }
const mapToRuleConfig = map(toRuleConfig)

const separateArgs = split(",")
const argsAreArray = contains(",")
const stringOrArray: (str: string) => string | ReadonlyArray<string> =
  str => argsAreArray(str) ? separateArgs(str) : str

const extractArgs = split(":")
const mapExtractArgs = map(extractArgs)
const separateRules = split("|")
const parse: (str: string) => ReadonlyArray<Parsed> =
  str => mapToRuleConfig(mapExtractArgs(separateRules(str)))

export default parse;
