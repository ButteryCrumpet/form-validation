import { State, StringMap } from "./typings"

const render: (messages: StringMap, prettyNames: StringMap) => (state: State, triggered?: string | undefined | null) => void =
  (messages, prettyNames) => (state, triggered) => {
    state.forEach(field => {
      if (triggered !== field.name && triggered !== undefined) {
        return
      }
      const errorElement = <HTMLElement>document.querySelector(`[data-pp-e=${field.name}]`)
      if (field.errors.length <= 0) {
        errorElement.style.display = "none"
        return
      }
      errorElement.style.display = "block"
      if (errorElement) {
        errorElement.innerHTML = field.errors.reduce((str, error) => {
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