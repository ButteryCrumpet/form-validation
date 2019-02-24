import * as f from "../../src/form/field";

describe("fields", () => {

  const name = "name";
  const value = "value";
  const validation = "validation";
  const required = true;

  const testGetters = <T>(field: f.Field<T>) => {
    expect(f.name(field)).toEqual(name);
    expect(f.value(field)).toEqual(value);
    expect(f.validation(field)).toEqual(validation);
    expect(f.required(field)).toEqual(required);
  };

  describe("valid ", () => {
    const field = f.valid(name, value, validation, required);
    test ("getters work", () => testGetters(field));
    test("is valid", () => expect(f.isValid(field)).toBe(true));
    test("is not invalid", () => expect(f.isInvalid(field)).toBe(false));
    test("is not dirty", () => expect(f.isDirty(field)).toBe(false));
  });

  describe("invalid", () => {
    const field = f.invalid(name, value, validation, required, ["error"]);
    test ("getters work", () => testGetters(field));
    test("correct errors", () => expect(f.errors(field)).toEqual(["error"]));
    test("is not valid", () => expect(f.isValid(field)).toBe(false));
    test("is invalid", () => expect(f.isInvalid(field)).toBe(true));
    test("is not dirty", () => expect(f.isDirty(field)).toBe(false));
  });

  describe("unverified", () => {
    const field = f.unverified(name, value, validation, required);
    test ("getters work", () => testGetters(field));
    test("is unverified", () => expect(f.isUnverified(field)).toBe(true));
    test("is not valid", () => expect(f.isValid(field)).toBe(false));
    test("is invalid", () => expect(f.isInvalid(field)).toBe(false));
    test("is not dirty", () => expect(f.isDirty(field)).toBe(false));
  });

  describe("dirty", () => {
    const field = f.dirty(name, value, validation, required);
    test ("getters work", () => testGetters(field));
    test("is unverified", () => expect(f.isUnverified(field)).toBe(true));
    test("is not valid", () => expect(f.isValid(field)).toBe(false));
    test("is invalid", () => expect(f.isInvalid(field)).toBe(false));
    test("is dirty", () => expect(f.isDirty(field)).toBe(true));
  });

});