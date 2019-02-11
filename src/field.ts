import { Result, Ok, Err, isOk } from "./result";

type Value = Result<string, string[]>

export type Field = {
  required: boolean
  name: string
  value: Value
}

export type Validation<T> = (field: string) => Value

type fromElement = (ele: HTMLInputElement) => Result<Field, string>
export const fromElement: fromElement
  = ele => {
    if (!ele.hasAttribute("name")) {
      return Err("Must have a name attribute")
    }
    return Ok({
      name: ele.name,
      required: ele.required,
      value: Ok(ele.value)
    })
  }

type update = (field: Field) => (value: string) => Field
export const update: update
  = field => value => ({...field, value: Ok(value)})

type isValid = (field: Field) => boolean
export const isValid: isValid
  = field => isOk(field.value)

type validate = <T>(validation: Validation<T>) => (field: Field) => Value
export const validate: validate
 = validation => field => validation(field.value)