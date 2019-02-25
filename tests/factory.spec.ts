import { factory, Context, RuleList } from "../src/validation/factory";

describe("validation builder", () => {

  const vconf: RuleList = {
    "test": (x: string) => (d: string) => x === d,
    "test2": () => () => true,
    "test3": () => (d: string, context) => context
      ? context.test
        ? context.test === d
        : false
      : false
  };

  const conf = [
    {
      name: "test",
      args: ["1"]
    }, {
      name: "test2",
      args: []
    }, {
      name: "test3",
      args: []
    }
  ];
  
  const funcs = factory(vconf)(conf, true);

  test("validates a validatable", () => {
    expect(funcs("1", {test: "1"})).toEqual([]);
  });

  test("invalidates a validatable", () => {
    expect(funcs("2")).toEqual(["test", "test3"]);
  });

  test("invalidates a required", () => {
    expect(funcs("")).toEqual(["required"]);
  });

});