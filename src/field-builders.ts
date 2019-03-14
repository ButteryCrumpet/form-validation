import { Insertable } from "./form/form";


type inputToField = (input: HTMLInputElement, attr: string) => Insertable<string>;
export const inputToField: inputToField = (input, attr) =>
  {
    const vr = getValidationRequired(input.getAttribute(attr) || "", input.required);
    return {
      name: input.name,
      value: getValue(input),
      validation: vr[0],
      required: vr[1]
    };
  };



type getValue = (input: HTMLInputElement) => string | string[];
const getValue: getValue = input =>
  {
    if (input.type === "checkbox") {
      return getCheckboxValue(input);
    }
    return input.value;
  };



type getCheckboxValue = (input: HTMLInputElement) => string | string[];
const getCheckboxValue: getCheckboxValue = input =>
  {
    if (!isMulti(input)) {
      return input.checked ? input.value : "";
    }

    return Array.prototype.slice
      .call(document.querySelectorAll(`[name="${input.name}"]:checked`))
      .map(sib => sib.value);
  };



type isMulti = (input: HTMLInputElement) => boolean;
const isMulti: isMulti = input =>
  {
    return input.name.substring(input.name.length - 2) === "[]";
  };



type getValidationRequired = (validation: string, required: boolean) => [string, boolean];
const getValidationRequired: getValidationRequired = (validation, required) =>
  {
    const req = validation.indexOf("required") > -1 || required;
    const val = validation === "required"
      ? ""
      : validation.replace("|required", "").replace("required|", "");

    return [val, req];
  };