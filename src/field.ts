import { Result, Ok, Err } from "./result";
import factory from "./factory"
import validators from "./default-validator-conf"
import parse from "./parser"

const VALIDATION_ATTR = "data-pp-v"

interface Field {
  required: boolean
  name: string
  value: string | boolean
  validator: Function
  errors: ReadonlyArray<string>
}

const loadedFactory = factory(validators)

type fromElement = (ele: HTMLInputElement) => Result<Field, string>
export const fromElement: fromElement
  = ele => {
    if (!ele.hasAttribute("name")) {
      return Err("Must have a name attribute")
    }
    const validation = ele.getAttribute(VALIDATION_ATTR) || ""
    const field = {
      name: ele.getAttribute("name") || "",
      required: validation.lastIndexOf("required") !== -1 || ele.required,
      value: ele.value,
      validator: loadedFactory(parse(validation)),
      errors: []
    }
    return Ok(field)
  }

type update = (field: Field) => (value: string) => Field
export const validate: update
  = field => value => ({...field, value: value, errors: field.validator(value)})

type isValid = (field: Field) => boolean
export const isValid: isValid
  = field => field.errors.length === 0
