import * as Redux from "redux";
import { reducer } from "./reducer";
import { render } from "./render";
import { inputToField } from "./field-builders";

type Configuration = {
  form?: HTMLFormElement;
  formAttr?: string;
  vAttr?: string;
  names?: { [key: string]: string };
  messages?: { [key: string]: string };
  debug?: boolean;
};

const defaultConfig: Configuration = {
  messages: {
    required: "{name}を入力してください",
    default: "{name}は無効です"
  },
  formAttr: "data-pp-form",
  vAttr: "data-v",
  debug: false
};

export function init(config: Configuration) {
  config = { ...defaultConfig, ...config };

  const form = config.form
    ? config.form
    : (document.querySelector(`[${config.formAttr}]`) as HTMLFormElement);

  if (!form) {
    throw new Error(`No form with attribute ${config.formAttr}`);
  }

  const store = Redux.createStore(
    reducer,
    config.debug ? Redux.applyMiddleware(logger) : undefined
  );

  const _render = render(config.names || {}, config.messages || {});
  store.subscribe(() => {
    if (config.debug) {
      console.debug("Render start");
    }
    _render(store.getState());
  });

  const _updateEvent = updateEvent(store, config.vAttr || "");

  form.addEventListener("change", e => {
    if (config.debug) {
      console.debug("Native change event");
    }
    _updateEvent(e);
  });

  form.addEventListener(
    "invalid",
    e => {
      if (config.debug) {
        console.debug("Native invalid event");
      }
      e.preventDefault();
      _updateEvent(e);
    },
    true
  );

  form.addEventListener("submit", e => {
    if (config.debug) {
      console.debug("Native submit event");
    }
    e.preventDefault();
    store.dispatch({ type: "submit" });
  });

  store.dispatch({ type: "init", payload: { ele: form, attr: config.vAttr } });

  return (action: Redux.AnyAction) => store.dispatch(action);
}

type updateEvent = (store: Redux.Store, attr: string) => (e: Event) => void;
const updateEvent: updateEvent = (store, attr) => e => {
  const target = e.target as HTMLInputElement;
  store.dispatch({
    type: "update",
    payload: inputToField(target, attr)
  });
};

// Middleware

const logger: Redux.Middleware = store => next => action => {
  console.debug("dispatching", action);
  const result = next(action);
  console.debug("next state", store.getState());
  return result;
};
