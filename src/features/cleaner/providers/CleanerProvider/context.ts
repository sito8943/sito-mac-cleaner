import { createContext } from "react";

import { CleanerContextValue } from "./types";

export const CleanerContext = createContext<CleanerContextValue | null>(null);
