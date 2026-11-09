import type { ReactNode } from "react";

export interface CheckboxPropsType {
  checked: boolean;
  /** Estado mixto (una sección con solo parte de sus elementos marcados). */
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  className?: string;
}
