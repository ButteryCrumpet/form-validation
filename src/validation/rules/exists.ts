



export function exists(str: string | null | undefined): str is string {
  return str != null;
}
