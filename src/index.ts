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
    const validator = factory(validators)(parse(attr))
    const newField = {
      name: name,
      validator: validator,
      value: ele.value,
      errors: validator(ele.value)
    }
    return [...acc, newField]
  }

const updateField = (name: string, value: string) => (field: Field) => {
  if (field.name !== name) {
    return { ...field }
  } 
  return { ...field, value: value, errors: field.validator(value) }
}
const update: (state: State) => (name: string, value: string) => State =
  (state) => (name, value) => {
    return state.map(updateField(name, value))
  }

const isValid: (state: State) => boolean =
  state => state.reduce((pass, field) => pass && field.errors.length === 0, true)

const addEventListeners: (state: State, form: HTMLFormElement, renderFunc: Function) => void =
(state, form, renderFunc) => {
  const func = (event: Event) => {
    const target = <HTMLInputElement>event.target
    const name = target.getAttribute("name") || ""
    const value = target.value
    const newState = update(state)(name, value)
    renderFunc(newState, name)
    form.removeEventListener("change", func, true)
    form.removeEventListener("submit", submitFunc)
    addEventListeners(newState, form, renderFunc)
  }

  const submitFunc = (event: Event) => {
    event.preventDefault()
    if (isValid(state)) {
      form.submit()
    }
    renderFunc(state)
    form.removeEventListener("change", func, true)
    form.removeEventListener("submit", submitFunc)
    addEventListeners(state, form, renderFunc)
  }
  form.addEventListener("change", func, true)
  form.addEventListener('submit', submitFunc)
}

export const init = (config: Config) => {
  const form = <HTMLFormElement>document.querySelector("[data-pp-form]")
  if (!form) {
    return false
  }
  const elements = toInputList(form.querySelectorAll(`[${V_ATTR}]`))
  const state = elements.reduce(initState, [])
  const loadedRender = render(config.messages || {}, config.prettyNames || {})
  addEventListeners(state, form, loadedRender)
}
