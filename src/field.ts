import { Result, Ok, Err } from "./result";

export interface Field {
  readonly required: boolean
  readonly name: string
  readonly value: string
  readonly errors: string[]
}

export type Validation<T> = (field: string) => Result<Field, T>

type fromElement = (ele: HTMLInputElement) => Result<Field, string>
export const fromElement: fromElement
  = ele => {
    if (!ele.hasAttribute("name")) {
      return Err("Must have a name attribute")
    }
    const field = {
      name: ele.getAttribute("name") || "",
      required: ele.required,
      value: ele.value,
      errors: []
    }
    return Ok(field)
  }

type update = (field: Field) => (value: string) => Field
export const update: update
  = field => value => ({...field, value: value})

type isValid = (field: Field) => boolean
export const isValid: isValid
  = field => field.errors.length === 0

type validate = <T>(validation: Validation<T>) => (field: Field) => Result<Field, T>
export const validate: validate
 = validation => field => validation(field.value)