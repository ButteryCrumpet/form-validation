import * as Redux from "redux";
import { reducer } from "./reducer";
import { render } from "./render";


type Configuration = {
  names?: {[key: string]: string}
  messages?: {[key: string]: string}
};

export function init(config: Configuration) {

  const form = document.querySelector(`[data-pp-form]`) as HTMLFormElement;
  if (!form) {
    throw new Error("No form with attribute");
  }

  const store = Redux.createStore(reducer);
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    store.dispatch({type: "submit"});
  });

  store.dispatch({type: "init", payload: { ele: form, attr: "data-pp-v" }});
}

