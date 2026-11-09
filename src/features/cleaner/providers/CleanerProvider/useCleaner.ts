import { useContext } from "react";

import { CleanerContext } from "./context";
import { CleanerContextValue } from "./types";

export function useCleaner(): CleanerContextValue {
  const context = useContext(CleanerContext);
  if (!context) {
    throw new Error("useCleaner must be used within CleanerProvider");
  }
  return context;
}
