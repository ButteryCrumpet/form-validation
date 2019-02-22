import * as Redux from "redux";
import { fromForm } from "./entities/form";

enum ActionTypes {
  INIT = "init",
  UPDATE = "update",
  SUBMIT = "submit",
  EDIT = "edit",
  ADD = "add",
  REMOVE = "remove"
}

type FormActions = 
  { type: ActionTypes.INIT, payload: HTMLFormElement}
  | { type: ActionTypes.UPDATE, payload: string }
  | { type: ActionTypes.SUBMIT }
  | { type: ActionTypes.ADD, payload: HTMLInputElement }
  | { type: ActionTypes.REMOVE, payload: string };

interface Field { name: string; value: string; }

interface State {
  readonly form: HTMLFormElement;
  readonly fields: ReadonlyArray<Field>;
}

const reducer: Redux.Reducer = (state: State, action: FormActions) => {

  switch (action.type) {
    case ActionTypes.INIT:
      return { form: action.payload,  };
    case ActionTypes.UPDATE:
      return updateForm(state, action.payload);
    case ActionTypes.SUBMIT:
      return submitForm(state);
  }

  return state;
};

const store = Redux.createStore(reducer);
