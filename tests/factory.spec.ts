import factory from "../src/factory";

describe("validation builder", () => {
  const vconf = [
    {
      name: "test",
      fn: (x: number) => (d: string) => x.toString() === d
    }, {
      name: "test2",
      fn: () => true
    }
  ]
  const conf = [
    {
      name: "test",
      args: 1
    }, {
      name: "test2"
    }
  ]
  const funcs = factory(vconf)(conf)
  test("validates a validatable", () => {
    expect(funcs("1")).toEqual([])
  })
  test("invalidates a validatable", () => {
    expect(funcs("2")).toEqual(["test"])
  })
})