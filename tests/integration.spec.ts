import parse from "../src/parser"
import factory from "../src/factory"
import * as rules from "../src/rules";

describe("parser & factory integration", () => {
  const configuredFactory = factory([
    {name: "required", fn: rules.existsAndFilled},
    {name: "blacklist", fn: rules.blacklist},
    {name: "this-string", fn: rules.regex(/this string/)}
  ])
  const parsed = parse("required|blacklist:hi,ho|this-string")
  const validation = configuredFactory(parsed)
  test("generates a function", () => {
    expect(validation).toBeInstanceOf(Function)
  })
  test("validates correctly", () => {
    expect(validation("this string")).toEqual([])
  })
  test("invalidates correctly", () => {
    expect(validation("hi")).toEqual(["blacklist", "this-string"])
  })
  test("false on empty if required", () => {
    expect(validation("")).toEqual(["required", "this-string"])
  })
})