/**
 * Utility functions for A2UI
 */

import type { DynamicValue, JsonPointer } from "./types";
import type { DataModelStore } from "./types";

/** Check if value is a path binding */
export function isPathBinding<T>(
  v: DynamicValue<T> | undefined
): v is { path: JsonPointer } {
  return (
    v !== undefined &&
    v !== null &&
    typeof v === "object" &&
    "path" in v &&
    typeof (v as { path: unknown }).path === "string"
  );
}

/** Resolve a dynamic value (literal or path binding) from data model */
export function resolveValue<T>(
  binding: DynamicValue<T> | undefined,
  fallback: T,
  dataModel: DataModelStore
): T {
  if (binding === undefined || binding === null) return fallback;
  if (isPathBinding(binding)) {
    const value = dataModel.get(binding.path);
    return (value !== undefined ? value : fallback) as T;
  }
  return binding as T;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
