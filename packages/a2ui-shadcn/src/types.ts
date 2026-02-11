/**
 * A2UI Protocol v0.9 Type Definitions
 * @see https://a2ui.org/specification/v0.9-a2ui/
 */

import type { ReactNode } from "react";

/** JSON Pointer path for data binding (RFC 6901) */
export type JsonPointer = string;

/** Dynamic value: literal or path binding */
export type DynamicValue<T> = T | { path: JsonPointer };

/** Function call reference */
export interface FunctionCallRef {
  call: string;
  args?: Record<string, unknown>;
  returnType?: string;
}

/** Data binding with path or function call */
export interface PathBinding {
  path: JsonPointer;
}

/** Validation check definition */
export interface CheckDefinition {
  call: string;
  args?: Record<string, unknown>;
  message?: string;
}

/** Action event for server-side handling */
export interface ActionEvent {
  name: string;
  context?: Record<string, unknown>;
}

/** Action: event or function call */
export interface ActionDefinition {
  event?: ActionEvent;
  functionCall?: FunctionCallRef;
}

/** Child list: static array or template */
export type ChildList =
  | string[]
  | { path: JsonPointer; componentId: string };

/** A2UI message version */
export type A2UIVersion = "v0.9";

/** Create surface message */
export interface CreateSurfaceMessage {
  surfaceId: string;
  catalogId: string;
  theme?: A2UITheme;
  sendDataModel?: boolean;
  config?: SurfaceConfig;
}

/** Surface configuration (e.g. dir for RTL) */
export interface SurfaceConfig {
  dir?: "ltr" | "rtl";
}

/** Theme tokens */
export interface A2UITheme {
  primary?: string;
  primaryColor?: string;
  secondary?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  typography?: {
    base?: { family?: string; size?: string };
    heading?: { family?: string };
  };
  spacing?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  colors?: Record<string, string>;
}

/** Update components message */
export interface UpdateComponentsMessage {
  surfaceId: string;
  components: A2UIComponent[];
}

/** Update data model message */
export interface UpdateDataModelMessage {
  surfaceId: string;
  path?: JsonPointer;
  value?: unknown;
}

/** Delete surface message */
export interface DeleteSurfaceMessage {
  surfaceId: string;
}

/** Generic A2UI component (base) */
export interface A2UIComponentBase {
  id: string;
  component: string;
  [key: string]: unknown;
}

/** A2UI component with typed children */
export interface A2UIComponent extends A2UIComponentBase {
  children?: string[];
  child?: string;
}

/** Envelope message types */
export type A2UIMessage =
  | { version: A2UIVersion; createSurface: CreateSurfaceMessage }
  | { version: A2UIVersion; updateComponents: UpdateComponentsMessage }
  | { version: A2UIVersion; updateDataModel: UpdateDataModelMessage }
  | { version: A2UIVersion; deleteSurface: DeleteSurfaceMessage };

/** Client-to-server action message */
export interface ActionMessage {
  version: A2UIVersion;
  action: {
    surfaceId: string;
    sourceComponentId: string;
    name: string;
    context?: Record<string, unknown>;
    timestamp: string;
    dataModel?: Record<string, unknown>;
  };
}

/** Transport adapter types */
export type TransportType = "websocket" | "sse" | "manual";

export interface WebSocketTransport {
  type: "websocket";
  url: string;
}

export interface SSETransport {
  type: "sse";
  url: string;
  actionEndpoint?: string;
}

export interface ManualTransport {
  type: "manual";
}

export type TransportConfig =
  | WebSocketTransport
  | SSETransport
  | ManualTransport;

/** Props passed to component adapters */
export interface ComponentAdapterProps {
  component: A2UIComponent;
  children?: ReactNode;
  dataModel: DataModelStore;
  surfaceId: string;
  onAction: (action: Omit<ActionMessage["action"], "version">) => void;
  dir: "ltr" | "rtl";
  theme?: A2UITheme;
  resolveValue: <T>(binding: DynamicValue<T> | undefined, fallback: T) => T;
}

/** Component registry: map component type to React component */
export type ComponentRegistry = Record<
  string,
  (props: ComponentAdapterProps) => ReactNode
>;

/** Data model store interface */
export interface DataModelStore {
  get: (path: JsonPointer) => unknown;
  set: (path: JsonPointer, value: unknown) => void;
  subscribe: (path: JsonPointer, callback: (value: unknown) => void) => () => void;
  getAll: () => Record<string, unknown>;
}
