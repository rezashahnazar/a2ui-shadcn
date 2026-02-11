"use client";

/**
 * useA2UIDataModel - access and update the reactive data model
 */

import { useSyncExternalStore, useCallback } from "react";
import type { JsonPointer } from "./types";
import { useSurfaceDataModel } from "./context";

export function useA2UIDataModel<T = unknown>(
  path: JsonPointer
): [T | undefined, (value: T) => void] {
  const ctx = useSurfaceDataModel();
  if (!ctx) {
    throw new Error("useA2UIDataModel must be used within an A2UISurface or SurfaceDataModelProvider");
  }

  const { dataModel } = ctx;

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return dataModel.subscribe(path, onStoreChange);
    },
    [dataModel, path]
  );

  const getSnapshot = useCallback(() => {
    return dataModel.get(path) as T | undefined;
  }, [dataModel, path]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setValue = useCallback(
    (v: T) => {
      dataModel.set(path, v);
    },
    [dataModel, path]
  );

  return [value, setValue];
}
