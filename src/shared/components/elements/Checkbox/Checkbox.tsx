import { useEffect, useRef } from "react";

import { CheckboxPropsType } from "./types";

import "@/styles/components/Checkbox.css";

/**
 * @sito/ui 0.9.0 no trae checkbox: esta es la primitiva de la app (§14.1),
 * el único sitio donde puede aparecer un <input> crudo.
 */
export function Checkbox({
  checked,
  indeterminate = false,
  disabled = false,
  onChange,
  children,
  className,
}: CheckboxPropsType) {
  const ref = useRef<HTMLInputElement>(null);

  // `indeterminate` solo existe como propiedad del DOM, no como atributo HTML.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={`Checkbox${className ? ` ${className}` : ""}`}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="Checkbox-label">{children}</span>
    </label>
  );
}
