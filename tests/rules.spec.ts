import * as v from "../src/validation/rules";

describe("exists or not", () => {
  test("null doesn't exist", () => {
    expect(v.exists(null)).toBe(false);
  });
  test("undefined doesn't exist", () => {
    expect(v.exists(undefined)).toBe(false);
  });
  test("zero exists", () => {
    expect(v.exists("0")).toBe(true);
  });
  //test("NaN doesn't exist", () => {
  //  expect(v.exists(NaN)).toBe(false);
  //})
  test("string exists", () => {
    expect(v.exists("hi")).toBe(true);
  });
});

describe("is digits", () => {
  const shouldMatch = [
    "010",
    "2.24",
  ];
  const shouldNotMatch = [
    "0-10000",
    "hi",
    "09h"
  ];
  shouldMatch.forEach((testable) => {
    test(`it matches ${testable}`, () => {
      expect(v.numeric(testable)).toBe(true);
    });
  });
  shouldNotMatch.forEach((testable) => {
    test(`it doesn't match ${testable}`, () => {
      expect(v.numeric(testable)).toBe(false);
    });
  });
});

describe("whitelist filters correctly", () => {
  const shouldMatch = [
    "this",
    "that",
    "another"
  ];
  const shouldNotMatch = [
    "not this",
    "not that",
  ];
  const func = v.whitelist(["this", "that", "another"]);
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
});

describe("blacklist filters correctly", () => {
  const shouldMatch = [
    "not this",
    "not that",
  ];
  const shouldNotMatch = [
    "this",
    "that",
    "another",
  ];
  const func = v.blacklist(["this", "that", "another"]);
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
});

describe("greaterThan validates correctly", () => {
  test("5 > 2 = true", () => {
    expect(v.greaterThan(2)("5")).toBe(true);
  });
  test("5 < 2 = false", () => {
    expect(v.greaterThan(5)("2")).toBe(false);
  });
});

describe("file extension", () => {
  test("file extension succeeds", () => {
    expect(v.extension(["pdf", "doc"])("c://fakepath/hi.pdf")).toBe(true);
  });
  test("file extension fails", () => {
    expect(v.extension(["xlsx", "doc"])("c://fakepath/hi.pdf")).toBe(false);
  });
});
