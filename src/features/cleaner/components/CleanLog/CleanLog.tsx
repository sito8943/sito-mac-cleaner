import { useEffect, useRef } from "react";

import { t } from "@/lang";
import { CleanLogProps } from "./types";

import "@/styles/components/CleanLog.css";

/** Salida de disk-clean tal cual, como en la terminal. */
export function CleanLog({ lines }: CleanLogProps) {
  const ref = useRef<HTMLPreElement>(null);

  // Sigue la última línea mientras llegan, como `tail -f`.
  useEffect(() => {
    const element = ref.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [lines]);

  return (
    <section className="CleanLog">
      <h2>{t("logTitle")}</h2>
      <pre ref={ref}>{lines.join("\n")}</pre>
    </section>
  );
}
