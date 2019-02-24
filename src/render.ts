import { State } from "./reducer";
import { all } from "./form/form";
import { isInvalid } from "./form/field";


interface StringHash {
  [key: string]: string;
}

type render = (prettyNames: StringHash, messages: StringHash) => (state: State) => void;
export const render: render = (prettyNames, messages) => state =>
  {
    all(state.form)
      .forEach(field => {
        const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`[data-pp-e=${field.name}]`);
        
        if (!isInvalid(field)) {
          elements.forEach(e => e.style.display = "none");
          return;
        }
        
        const name = prettyNames.hasOwnProperty(field.name)
          ? prettyNames[field.name]
          : field.name;

        elements.forEach((ele) => {
          ele.innerHTML = "";
          field.errors.forEach(error => {
            let str = error;

            if (messages.hasOwnProperty(error + "_" + field.name)) {
              str = messages[error + "_" + field.name].replace("{name}", name);
            } else if (messages.hasOwnProperty(error)) {
              str = messages[error].replace("{name}", name);
            } else if (messages.hasOwnProperty("default")) {
              str = messages["default"].replace("{name}", name);
            }
          
            const p = document.createElement("p");
            console.log(p, str, ele);
            p.textContent = str;
            ele.appendChild(p);
            ele.style.display = "block";
          });
        });
      });
  };