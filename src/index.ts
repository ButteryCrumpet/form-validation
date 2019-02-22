import parse from "./validation/parser";
import factory from "./validation/factory";
import validators from "./validation/default-validator-conf";
import Program from "./program";

const V_ATTR = "data-pp-v";
const F_ATTR = "data-pp-form";

interface StringMap { [key: string]: string; }

interface Config {
  messages?: StringMap;
  prettyNames?: StringMap;
  scrollOffset?: number;
}

// MODEL

type State = {
  form: HTMLFormElement
  fields: ReadonlyArray<Field>
};

interface Field {
  updated: boolean;
  required: boolean;
  name: string;
  value: string | boolean;
  validator: Function;
  errors: ReadonlyArray<string>;
}

export const init = (config: Config) => {
  const form = document.querySelector(`[${F_ATTR}]`) as HTMLFormElement;
  if (!form) {
    return false;
  }
  const fields = toInputList(form.querySelectorAll(`[${V_ATTR}]`)).reduce(initState, []);
  const state = {form, fields};
  const loadedRender = render(config.messages || {}, config.prettyNames || {});
  const run = Program(state, update, loadedRender);
  // run("init");

  form.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    const val = target.type == "checkbox" ? target.checked : target.value;
    run({ name: target.getAttribute("name") || "", value: val });
  }, true);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    run("submit");
    const scrollTo = form.getBoundingClientRect().top + window.scrollY - (config.scrollOffset || 0);
    window.scroll({
      left: 0,
      top: scrollTo,
      behavior: "smooth"
    });
  });
  
  return true;
};

const loadedFactory = factory(validators);
const initState: (acc: ReadonlyArray<Field>, ele: HTMLInputElement) => ReadonlyArray<Field> =
  (acc, ele) => {
    const attr = ele.getAttribute(V_ATTR);
    if (!attr) {
      return acc;
    }
    const name = ele.getAttribute("name");
    if (!name) {
      return acc;
    }
    const validator = loadedFactory(parse(attr));
    const required = attr.lastIndexOf("required") !== -1;
    const newField = {
      updated: true,
      required,
      name,
      validator,
      value: ele.type == "checkbox" ? ele.checked : ele.value,
      errors: []
    };
    newField.errors = validate(newField, newField.value);
    return [...acc, newField];
  };


// UPDATE

type Msg = { name: string, value: string | boolean } | "submit" | "init";
const update: (msg: Msg, state: State) => State =
  (msg, state) => {
    if (msg === "submit") {
      if (isValid(state.fields)) {
        state.form.submit();
      }
      return {...state, fields: state.fields.map(field => ({...field, updated: true}))};
    } else if (msg === "init") {
      return state;
    }
    return {...state, fields: state.fields.map(updateField(msg.name, msg.value))};
  };


// VIEW

const render: (messages: StringMap, prettyNames: StringMap) => (state: State) => void =
  (messages, prettyNames) => (state) => {
    state.fields.forEach(field => {
      if (!field.updated) {
        return false;
      }
      const errorElement: HTMLElement | null = document.querySelector(`[data-pp-e=${field.name}]`);
      if (!errorElement) {
        return;
      }
      if (field.errors.length <= 0) {
        errorElement.style.display = "none";
        return;
      }
      errorElement.style.display = "block";
      errorElement.innerHTML = field.errors.reduce((str, error) => {
        const name = prettyNames.hasOwnProperty(field.name)
            ? prettyNames[field.name]
            : field.name;
            
        if (messages.hasOwnProperty(error + "_" + field.name)) {
          const message = messages[error + "_" + field.name].replace("{name}", name);
          return str += `<p>${message}</p>`;
        }
        if (messages.hasOwnProperty(error)) {
          const message = messages[error].replace("{name}", name);
          return str += `<p>${message}</p>`;
        }
        if (messages.hasOwnProperty("default")) {
          const message = messages["default"].replace("{name}", name);
          return str += `<p>${message}</p>`;
        }
        return str += `<p>${error}</p>`;
      }, "");
    });
  };


// HELPERS

const isValid: (state: ReadonlyArray<Field>) => boolean =
  state => state.reduce((pass, field) => pass && field.errors.length === 0, true);

const validate = (field: Field, newVal: string | boolean) => {
  if (newVal === "" && !field.required) {
    return [];
  }
  if (newVal === false && field.required) {
    return ["required"];
  } else if (newVal === true && field.required) {
    return [];
  }
  return field.validator(newVal);
};

const updateField = (name: string, value: string | boolean) => (field: Field) => {
  if (field.name !== name) {
    return { ...field, updated: false };
  } 
  return {
    ...field, updated: true,
    value,
    errors: validate(field, value)
  };
};

const toInputList: (nodes: NodeList) => ReadonlyArray<HTMLInputElement> =
  nodes => Array.prototype.slice.call(nodes).map((n: Element) => n as HTMLInputElement); 