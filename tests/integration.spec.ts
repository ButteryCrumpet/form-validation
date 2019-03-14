import { parse } from "../src/validation/parser";
import { factory } from "../src/validation/factory";
import { ruleFactories } from "../src/validation/default-validator-conf";

describe("parser & factory integration", () => {

  const configuredFactory = factory(ruleFactories);
  const parsed = parse("blacklist:hi,ho|whitelist:this string");
  const validation = configuredFactory(parsed, true);

  test("generates a function", () => {
    expect(validation).toBeInstanceOf(Function);
  });

  test("validates correctly", () => {
    expect(validation("this string")).toEqual([]);
    expect(validation(["this string", "this string"])).toEqual([]);
  });

  test("invalidates correctly", () => {
    expect(validation("hi")).toEqual(["blacklist", "whitelist"]);
    expect(validation(["hi", 'this string'])).toEqual(["blacklist", "whitelist"]);
  });

  test("false on empty if required", () => {
    expect(validation("")).toEqual(["required"]);
    expect(validation([])).toEqual(["required"]);
  });

});