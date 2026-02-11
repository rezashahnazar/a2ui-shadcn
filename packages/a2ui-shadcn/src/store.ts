/**
 * Reactive data model store with JSON Pointer support (RFC 6901)
 */

import { createStore } from "zustand/vanilla";
import type { DataModelStore as IDataModelStore, JsonPointer } from "./types";

/** Resolve JSON Pointer to value (supports /path/to/key and /path/0/array) */
function getByPath(obj: Record<string, unknown>, path: JsonPointer): unknown {
  if (!path || path === "/") return obj;
  const parts = path.replace(/^\//, "").split("/");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    const key = part.replace(/~1/g, "/").replace(/~0/g, "~");
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/** Set value at JSON Pointer path */
function setByPath(
  obj: Record<string, unknown>,
  path: JsonPointer,
  value: unknown
): Record<string, unknown> {
  const result = JSON.parse(JSON.stringify(obj));
  if (!path || path === "/") return value as Record<string, unknown>;
  const parts = path.replace(/^\//, "").split("/");
  let current: Record<string, unknown> = result;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i].replace(/~1/g, "/").replace(/~0/g, "~");
    const nextKey = parts[i + 1];
    const isArrayIndex = /^\d+$/.test(nextKey);
    if (!(part in current) || current[part] === null || current[part] === undefined) {
      current[part] = isArrayIndex ? [] : {};
    }
    current = current[part] as Record<string, unknown>;
  }
  const lastPart = parts[parts.length - 1].replace(/~1/g, "/").replace(/~0/g, "~");
  current[lastPart] = value;
  return result;
}

export interface DataModelState {
  data: Record<string, unknown>;
}

export interface DataModelActions {
  get: (path: JsonPointer) => unknown;
  set: (path: JsonPointer, value: unknown) => void;
  getAll: () => Record<string, unknown>;
  replace: (data: Record<string, unknown>) => void;
}

export type DataModelStoreImpl = ReturnType<typeof createDataModelStoreImpl>;

function createDataModelStoreImpl(
  initialData: Record<string, unknown> = {}
) {
  return createStore<DataModelState & DataModelActions>((set, get) => ({
    data: initialData,

    get: (path) => {
      const { data } = get();
      return getByPath(data, path);
    },

    set: (path, value) => {
      set((state) => {
        const newData = setByPath(state.data, path, value);
        return { data: newData };
      });
    },

    getAll: () => get().data,

    replace: (data) => set({ data }),
  }));
}

/** Extended store with onChange for React re-renders */
export interface DataModelStoreWithChange extends IDataModelStore {
  onChange: (callback: () => void) => () => void;
}

/** Create a DataModelStore with the subscribe(path, callback) API */
export function createDataModelStore(
  initialData: Record<string, unknown> = {}
): DataModelStoreWithChange {
  const store = createDataModelStoreImpl(initialData);
  const subscriptions = new Map<string, Set<(value: unknown) => void>>();
  const changeListeners = new Set<() => void>();

  store.subscribe(() => {
    const data = store.getState().data;
    for (const [path, callbacks] of subscriptions) {
      const value = getByPath(data, path);
      for (const cb of callbacks) cb(value);
    }
    for (const cb of changeListeners) cb();
  });

  return {
    get: (path) => store.getState().get(path),
    set: (path, value) => store.getState().set(path, value),
    getAll: () => store.getState().getAll(),
    subscribe: (path: JsonPointer, callback: (value: unknown) => void) => {
      const key = path || "/";
      if (!subscriptions.has(key)) {
        subscriptions.set(key, new Set());
      }
      subscriptions.get(key)!.add(callback);
      return () => {
        subscriptions.get(key)?.delete(callback);
        if (subscriptions.get(key)?.size === 0) subscriptions.delete(key);
      };
    },
    onChange: (callback: () => void) => {
      changeListeners.add(callback);
      return () => changeListeners.delete(callback);
    },
  };
}
