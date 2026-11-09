import type { ButtonHTMLAttributes } from "react";

export type UnstyledButtonPropsType = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
>;
