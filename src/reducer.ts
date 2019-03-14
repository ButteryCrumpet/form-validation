import { Reducer } from "redux";
import { Form, ChangeSet, update, form, validate, valid, Insertable, insert, remove } from "./form/form";
import { validationFactory } from "./validation";
import { FormActions, Config, ActionTypes } from "./actions";
import { inputToField } from "./field-builders";


export interface State {
  readonly formElement: HTMLFormElement;
  readonly form: Form<string>;
  readonly attr: string;
}

const _validate = validate(memoise(validationFactory));

export const reducer: Reducer = (state: State, action: FormActions) => {

  switch (action.type) {
    case ActionTypes.INIT:
      return init(action.payload);
    case ActionTypes.UPDATE:
      return updateInput(state, action.payload);
    case ActionTypes.SUBMIT:
      return submitForm(state);
    case ActionTypes.ADD:
      return addInput(state, action.payload);
    case ActionTypes.REMOVE:
      return removeInput(state, action.payload);
    default:
      return state;
  }

};



// ACTION REDUCERS

type init = (config: Config) => State;
const init: init = config => 
  {
    const elements = config.ele.querySelectorAll(`[${config.attr}]`);
    const inputs = Array.prototype.slice.call(elements);
    
    return {
      formElement: config.ele,
      form: form(inputs.map(e => inputToField(e, config.attr))),
      attr: config.attr
    };
  };



type updateInput = (state: State, change: ChangeSet<string>) => State;
const updateInput: updateInput = (state, change) =>
  ({
    ...state,
    form: _validate(update(change, state.form))
  });



type addInput = (state: State, element: HTMLInputElement) => State;
const addInput: addInput = (state, element) =>
  ({
    ...state,
    form: insert(inputToField(element, state.attr))(state.form)
  });



type removeInput = (state: State, name: string) => State;
const removeInput: removeInput = (state, name) =>
  ({
    ...state,
    form: remove(name)(state.form)
  });



type submitForm = (state: State) => State;
const submitForm: submitForm = state =>
  {
    const form = _validate(state.form, true);
    if (valid(form)) {
      state.formElement.submit();
    }
    return { ...state, form };
  };



// HELPERS

type memo<T> = {[key: string]: T};
function memoise<T>(fn: (str: string, r: boolean) => T) {
  const memo: memo<T> = {};
  return (str: string, r: boolean) => {
    if (!memo.hasOwnProperty(`${str}${r ? "t" : "f"}`)) {
      memo[str] = fn(str, r);
    }
    return memo[str];
  };
}
