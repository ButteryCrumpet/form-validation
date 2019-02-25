import * as Redux from "redux";
import { reducer } from "./reducer";
import { render } from "./render";


type Configuration = {
  form?: HTMLFormElement
  formAttr?: string
  vAttr?: string
  names?: {[key: string]: string}
  messages?: {[key: string]: string}
  debug?: boolean
};

const defaultConfig: Configuration = {
  messages: {
    required: "{name} is required",
    default: "{name} is invalid",
  },
  formAttr: "data-pp-form",
  vAttr: "data-pp-v",
  debug: false,
};

export function init(config: Configuration) {

  config = { ...defaultConfig, ...config };

  const form = config.form
    ? config.form
    : document.querySelector(`[${config.formAttr}]`) as HTMLFormElement;
  
  if (!form) {
    throw new Error(`No form with attribute ${config.formAttr}`);
  }

  const store = Redux.createStore(
    reducer,
    config.debug ? Redux.applyMiddleware(logger) : undefined
  );

  const _render = render(config.names || {}, config.messages || {});
  store.subscribe(() => _render(store.getState()));
  
  form.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    store.dispatch({
      type: "update",
      payload: {
        name: target.name,
        value: target.value
      }
    });
  });

  form.addEventListener("invalid", (e) => {
    e.preventDefault();
  }, true);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    store.dispatch({type: "submit"});
  });

  store.dispatch({type: "init", payload: { ele: form, attr: config.vAttr }});

  return (action: Redux.AnyAction) => store.dispatch(action);
}


// Middleware

const logger: Redux.Middleware = store => next => action => {
  console.log("dispatching", action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};