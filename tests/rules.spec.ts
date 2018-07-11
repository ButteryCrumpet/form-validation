import * as v from "../src/rules";

describe("exists or not", () => {
  test("null doesn't exist", () => {
    expect(v.exists(null)).toBe(false);
  });
  test("undefined doesn't exist", () => {
    expect(v.exists(undefined)).toBe(false);
  });
  test("zero exists", () => {
    expect(v.exists(0)).toBe(true);
  });
  //test("NaN doesn't exist", () => {
  //  expect(v.exists(NaN)).toBe(false);
  //})
  test("string exists", () => {
    expect(v.exists("hi")).toBe(true);
  });
});

describe("empty or not", () => {
  test("empty string is empty", () => {
    expect(v.notEmpty("")).toBe(false);
  });
  test("filled string isn't empty", () => {
    expect(v.notEmpty("hi")).toBe(true);
  });
  test("empty array is empty", () => {
    expect(v.notEmpty([])).toBe(false);
  });
  test("filled array isn't empty", () => {
    expect(v.notEmpty(["hi", "ho"])).toBe(true);
  });
  test("empty object is empty", () => {
    expect(v.notEmpty({})).toBe(false);
  });
  test("filled object isn't empty", () => {
    expect(v.notEmpty({ hi: "you" })).toBe(true);
  });
});

describe("is digits", () => {
  var shouldMatch = [
    "010",
    "2.24",
    13.888,
    0,
    200
  ];
  var shouldNotMatch = [
    "0-10000",
    "hi",
    NaN,
    "09h"
  ];
  shouldMatch.forEach((testable) => {
    test(`it matches ${testable}`, () => {
      expect(v.digits(testable)).toBe(true);
    });
  });
  shouldNotMatch.forEach((testable) => {
    test(`it doesn't match ${testable}`, () => {
      expect(v.digits(testable)).toBe(false);
    });
  });
})

describe("whitelist filters correctly", () => {
  var shouldMatch = [
    "this",
    "that",
    "another"
  ];
  var shouldNotMatch = [
    "not this",
    "not that",
  ];
  let func = v.whitelist(["this", "that", "another"]);
  shouldMatch.forEach((testable) => {
    test(`it matches ${testable}`, () => {
      expect(func(testable)).toBe(true);
    });
  });
  shouldNotMatch.forEach((testable) => {
    test(`it doesn't match ${testable}`, () => {
      expect(func(testable)).toBe(false);
    });
  });
})

describe("blacklist filters correctly", () => {
  var shouldMatch = [
    "not this",
    "not that",
  ];
  var shouldNotMatch = [
    "this",
    "that",
    "another",
  ];
  let func = v.blacklist(["this", "that", "another"]);
  shouldMatch.forEach((testable) => {
    test(`it matches ${testable}`, () => {
      expect(func(testable)).toBe(true);
    });
  });
  shouldNotMatch.forEach((testable) => {
    test(`it doesn't match ${testable}`, () => {
      expect(func(testable)).toBe(false);
    });
  });
})

describe("greaterThan validates correctly", () => {
  test("5 > 2 = true", () => {
    expect(v.greaterThan(2)("5")).toBe(true)
  })
  test("5 < 2 = false", () => {
    expect(v.greaterThan(5)("2")).toBe(false)
  })
})

describe("file extension", () => {
  test("file extension succeeds", () => {
    expect(v.extensions(["pdf", "doc"])("c:/fakepath/hi.pdf")).toBe(true)
  })
  test("file extension fails", () => {
    expect(v.extensions(["xlsx", "doc"])("c:/fakepath/hi.pdf")).toBe(false)
  })
})
