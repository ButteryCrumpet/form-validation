import * as f from "../../src/form/form";

describe("form", () => {

  test("create form", () => {
    const field = {name: "name", validation: ""};
    const form = f.form([field]);
    expect(f.has("name")(form)).toBe(true);
    expect(f.get("name")(form)).toEqual({...field, type: "unverified", value: "", required: false});
  });

  test("insert field", () => {
    const field = {name: "name2", validation: ""};
    let form = f.form([{name: "name", validation: ""}]);
    form = f.insert(field)(form);
    expect(f.has("name2")(form)).toBe(true);
    expect(f.get("name2")(form)).toEqual({...field, type: "unverified", value: "", required: false});
  });

  test("update field", () => {
    let form = f.form([{name: "name", validation: ""}]);
    form = f.update({name: "name", value: "updated"}, form);
    expect(f.has("name")(form)).toBe(true);
    const got = f.get("name")(form);
    expect(got ? got.value : null).toBe("updated");
  });

  test("remove field", () => {
    let form = f.form([{name: "name", validation: ""}]);
    form = f.remove("name")(form);
    expect(f.has("name")(form)).toBe(false);
    expect(f.get("name")(form)).toBe(null);
  });

  describe("validate", () => {

    test("ignores unverified with no force", () => {
      let form = f.form([{name: "name", validation: ""}]);
      form = f.validate((input: string) => (v, c) => [])(form);
      expect(f.valid(form)).toBe(false);
    });

    test("validates dirtied", () => {
      let form = f.form([{name: "name", validation: ""}]);
      form = f.update({name: "name", value: "u"}, form);
      form = f.validate((input: string) => (v, c) => v === "u" ? [] : ["error"])(form, true);
      expect(f.valid(form)).toBe(true);
    });

    test("force validates", () => {
      let form = f.form([{name: "name", validation: ""}]);
      form = f.validate((input: string) => (v, c) => [])(form, true);
      expect(f.valid(form)).toBe(true);
    });
    
  });

});