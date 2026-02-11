"use client";

/**
 * A2UIProvider - global configuration context
 */

import React, { createContext, useContext } from "react";
import type { A2UITheme, ComponentRegistry } from "./types";
import type { DataModelStoreWithChange } from "./store";

export interface A2UIProviderValue {
  defaultTheme?: A2UITheme;
  defaultDir?: "ltr" | "rtl";
  functions?: Record<string, (args: Record<string, unknown>) => void | Promise<void>>;
  componentRegistry?: ComponentRegistry;
}

const A2UIConfigContext = createContext<A2UIProviderValue | null>(null);

export interface A2UIProviderProps {
  defaultTheme?: A2UITheme;
  defaultDir?: "ltr" | "rtl";
  functions?: Record<string, (args: Record<string, unknown>) => void | Promise<void>>;
  componentRegistry?: ComponentRegistry;
  children: React.ReactNode;
}

export function A2UIProvider({
  defaultTheme,
  defaultDir = "ltr",
  functions: functionsProp,
  componentRegistry,
  children,
}: A2UIProviderProps) {
  const value: A2UIProviderValue = {
    defaultTheme,
    defaultDir,
    functions: functionsProp,
    componentRegistry,
  };

  return (
    <A2UIConfigContext.Provider value={value}>
      {children}
    </A2UIConfigContext.Provider>
  );
}

export function useA2UIConfig(): A2UIProviderValue | null {
  return useContext(A2UIConfigContext);
}

/** Surface-specific context for useA2UIDataModel */
const SurfaceDataModelContext = createContext<{
  surfaceId: string;
  dataModel: DataModelStoreWithChange;
} | null>(null);

export const SurfaceDataModelProvider = SurfaceDataModelContext.Provider;

export function useSurfaceDataModel() {
  return useContext(SurfaceDataModelContext);
}
