/**
 * a2ui-shadcn - A2UI protocol renderer for shadcn/ui
 */

export { A2UISurface } from "./surface";
export { A2UIProvider, useA2UIConfig } from "./context";
export { useA2UIDataModel } from "./hooks";
export { registerFunction, registerContextFunction } from "./functions";
export { registerCheck } from "./validation";

export type {
  A2UIMessage,
  CreateSurfaceMessage,
  UpdateComponentsMessage,
  UpdateDataModelMessage,
  ActionMessage,
  A2UIComponent,
  A2UITheme,
  TransportConfig,
  ComponentRegistry,
  ComponentAdapterProps,
  DynamicValue,
  JsonPointer,
} from "./types";

export { createDataModelStore } from "./store";
export { createTransport } from "./transport";
export { defaultRegistry } from "./adapters";
