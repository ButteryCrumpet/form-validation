import parse from "./parser"
import factory from "./factory"
import validators from "./default-validator-conf"
import render from "./error-renderer"
import { Field, State, Config } from "./typings"

const V_ATTR = "data-pp-v"

const toInputList: (nodes: NodeList) => ReadonlyArray<HTMLInputElement> =
  nodes => Array.prototype.slice.call(nodes).map((n: Element) => <HTMLInputElement>n)  

const initState: (acc: State, ele: HTMLInputElement) => State =
  (acc, ele) => {
    const attr = ele.getAttribute(V_ATTR);
    if (!attr) {
      return acc
    }
    const name = ele.getAttribute("name")
    if (!name) {
      return acc
    }
    const newField = {
      name: name,
      validator: factory(validators)(parse(attr)),
      value: ele.value,
      errors: []
    }
    return [...acc, newField]
  }

const updateField = (field: Field) => {
  const casted = <HTMLInputElement>document.querySelector(`[name=${field.name}]`)
  return {...field, errors: field.validator(casted.value)}
}
const update: (state: State) => () => State =
  (state) => () => {
    return state.map(updateField)
  }

const isValid: (state: State) => boolean =
  state => state.reduce((pass, field) => pass && field.errors.length === 0, true)

export const init = (config: Config) => {
  const elements = toInputList(document.querySelectorAll(`[${V_ATTR}]`))
  const state = elements.reduce(initState, [])
  const loadedRender = render(config.messages || {}, config.prettyNames || {})
  let updateState = update(state)
  elements.forEach(e => e.addEventListener("change", (event) => {
      let state = updateState()
      loadedRender(state, e.getAttribute("name"))
      updateState = update(state)
  }))
  const form = <HTMLFormElement>document.querySelector("[data-pp-form]")
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      let state = updateState()
      if (isValid(state)) {
        form.submit()
      }
      updateState = update(state)
      loadedRender(state, "re-all")
    })
  }
}
