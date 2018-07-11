import parse from "../src/parser";

// rule:arg,arg|rule|rule:arg
// ->
// [{name: rule, args: [arg, arg]},{name: rule},{name: rule, args: arg}]

describe("parser", () => {
  test("parsers single rule", () => {
    expect(parse("rule")).toEqual([{name: "rule"}]);
  })
  test("parsers multiple rules", () => {
    expect(parse("rule1|rule2")).toEqual([{name: "rule1"}, {name: "rule2"}])
  })
  test("parsers single rule with single argument", () => {
    expect(parse("rule:hi")).toEqual([{name: "rule", args: "hi"}])
  })
  test("parsers single rule with arguments", () => {
    expect(parse("rule:hi,ho")).toEqual([{name: "rule", args: ["hi", "ho"]}])
  })
  test("parsers multiple rules with varying arguments", () => {
    expect(parse("rule:hi,ho|rule2:2|rule3")).toEqual([
      {name: "rule", args: ["hi", "ho"]},
      {name: "rule2", args: "2"},
      {name: "rule3"}
    ])
  });
})