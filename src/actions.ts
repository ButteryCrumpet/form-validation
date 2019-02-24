import { ChangeSet } from "./form/form";

export interface Config {
  ele: HTMLFormElement;
  attr: string;
}


export enum ActionTypes {
  INIT = "init",
  UPDATE = "update",
  SUBMIT = "submit",
  EDIT = "edit",
  ADD = "add",
  REMOVE = "remove"
}


export type FormActions = 
  { type: ActionTypes.INIT, payload: Config }
  | { type: ActionTypes.UPDATE, payload: ChangeSet<string> }
  | { type: ActionTypes.SUBMIT }
  | { type: ActionTypes.ADD, payload: HTMLInputElement }
  | { type: ActionTypes.REMOVE, payload: string };