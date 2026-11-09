/** Ids estables para enlazar pestaña ↔ panel (aria-controls / aria-labelledby). */
export const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
export const panelId = (prefix: string, id: string) => `${prefix}-panel-${id}`;
