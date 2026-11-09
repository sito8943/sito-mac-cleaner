export interface TabItem<T extends string> {
  id: T;
  label: string;
}

export interface TabsPropsType<T extends string> {
  tabs: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Prefijo para enlazar cada pestaña con su panel (aria-controls). */
  idPrefix: string;
  className?: string;
}
