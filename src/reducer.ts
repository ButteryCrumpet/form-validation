import { Reducer } from "redux";
import { Form, ChangeSet, update, form, validate, valid, Insertable } from "./form/form";
import { validationFactory } from "./validation";
import { FormActions, Config, ActionTypes } from "./actions";


export interface State {
  readonly formElement: HTMLFormElement;
  readonly form: Form<string>;
}

const _validate = validate(memoise(validationFactory));

export const reducer: Reducer = (state: State, action: FormActions) => {

  switch (action.type) {
    case ActionTypes.INIT:
      return init(action.payload);
    case ActionTypes.UPDATE:
      return updateForm(state, action.payload);
    case ActionTypes.SUBMIT:
      return submitForm(state);
    default:
      return state;
  }

};

type init = (config: Config) => State;
const init: init = config => 
  {
    const elements = config.ele.querySelectorAll(`[${config.attr}]`);
    const inputs = Array.prototype.slice.call(elements);
    
    return {
      formElement: config.ele,
      form: form(inputs.map(e => inputToField(e, config.attr)))
    };
  };



type updateForm = (state: State, change: ChangeSet<string>) => State;
const updateForm: updateForm = (state, change) =>
  ({
    formElement: state.formElement,
    form: _validate(update(change, state.form))
  });



type submitForm = (state: State) => State;
const submitForm: submitForm = state =>
  {
    const form = _validate(state.form, true);
    if (valid(form)) {
      state.formElement.submit();
    }
    return { formElement: state.formElement, form };
  };



type inputToField = (input: HTMLInputElement, attr: string) => Insertable<string>;
const inputToField: inputToField = (input, attr) =>
  {
    return {
      name: input.name,
      value: input.value,
      validation: input.getAttribute(attr) || "",
      required: input.required
    };
  };



type memo<T> = {[key: string]: T};
function memoise<T>(fn: (str: string) => T) {
  const memo: memo<T> = {};
  return (str: string) => {
    if (!memo.hasOwnProperty(str)) {
      memo[str] = fn(str);
    }
    return memo[str];
  };
}
