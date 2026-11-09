/** Une clases CSS ignorando las condiciones falsas. */
export function classNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
