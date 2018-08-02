
type Program =
  <T extends {}, M extends {}>(init: T, update: Update<M, T>, render: Render<T>) => Run<M>

type Update<M, T> = (message: M, state: T) => T
type Render<T> = (state: T) => any
type Run<M> = (message: M) => void

const Program: Program = (init, update, render) => {
  let state = init
  return (message) => {
    state = update(message, state)
    return render(state)
  }
}

export default Program