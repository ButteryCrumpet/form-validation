
type Update<M, T> = (message: M, state: T) => T;
type Render<T, U> = (state: T) => U;
type Run<M> = (message: M) => void;

type Program = <T, M, U>(init: T, update: Update<M, T>, render: Render<T, U>) => Run<M>;
export const program: Program = (init, update, render) => {
  let state = init;
  return (message) => {
    state = update(message, state);
    return render(state);
  };
};
