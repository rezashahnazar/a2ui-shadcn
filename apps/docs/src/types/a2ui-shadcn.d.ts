declare module "a2ui-shadcn" {
  import type { ReactNode } from "react";

  export interface A2UIMessage {
    version?: string;
    createSurface?: unknown;
    updateComponents?: unknown;
    updateDataModel?: unknown;
    deleteSurface?: unknown;
  }

  export interface A2UIAction {
    surfaceId: string;
    sourceComponentId: string;
    name: string;
    context?: Record<string, unknown>;
    timestamp: string;
    dataModel?: Record<string, unknown>;
  }

  export interface A2UISurfaceProps {
    surfaceId: string;
    messages?: A2UIMessage[];
    transport?: unknown;
    onAction?: (action: A2UIAction) => void;
    theme?: unknown;
    componentRegistry?: unknown;
    dir?: "ltr" | "rtl";
    className?: string;
  }

  export function A2UISurface(props: A2UISurfaceProps): ReactNode;
}
