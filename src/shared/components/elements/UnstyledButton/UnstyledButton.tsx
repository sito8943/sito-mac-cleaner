import { UnstyledButtonPropsType } from "./types";

/**
 * Botón sin estilos de @sito/ui (0.9.0 no tiene variante `unstyled`): para
 * controles con aspecto propio, como el botón del fin del mundo (§14.1).
 */
export function UnstyledButton(props: UnstyledButtonPropsType) {
  return <button type="button" {...props} />;
}
