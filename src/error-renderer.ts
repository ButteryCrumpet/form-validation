import { State, StringMap } from "./typings"

const render: (messages: StringMap, prettyNames: StringMap) => (state: State, triggered?: string | undefined | null) => void =
  (messages, prettyNames) => (state, triggered) => {
    state.forEach(field => {
      if (triggered !== field.name && triggered !== undefined) {
        return
      }
      let errorElement = document.querySelector(`[data-pp-e=${field.name}]`)
      if (!errorElement) {
        return
      }
      let casted = <HTMLElement>errorElement;
      if (field.errors.length <= 0) {
        casted.style.display = "none"
        return
      }
      casted.style.display = "block"
      if (casted) {
        casted.innerHTML = field.errors.reduce((str, error) => {
          const name = prettyNames.hasOwnProperty(field.name)
              ? prettyNames[field.name]
              : field.name
          if (messages.hasOwnProperty(error)) {
            const message = messages[error].replace("{name}", name)
            return str += `<p>${message}</p>`
          }
          if (messages.hasOwnProperty("default")) {
            const message = messages["default"].replace("{name}", name)
            return str += `<p>${message}</p>`
          }
          return str += `<p>${error}</p>`
        }, "")
      }
    });
  }

export default render