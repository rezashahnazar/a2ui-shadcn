/**
 * Built-in validation (checks) functions for A2UI
 */

import type { CheckDefinition } from "./types";

export type ValidationFunction = (
  args: Record<string, unknown>,
  resolveValue: (pathOrValue: unknown) => unknown
) => boolean;

const builtInChecks: Record<string, ValidationFunction> = {
  required: (args, resolve) => {
    const v = resolve(args.value);
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  },
  regex: (args, resolve) => {
    const v = resolve(args.value);
    const pattern = args.pattern as string;
    if (typeof v !== "string" || !pattern) return false;
    try {
      return new RegExp(pattern).test(v);
    } catch {
      return false;
    }
  },
  minLength: (args, resolve) => {
    const v = resolve(args.value);
    const min = args.min as number;
    if (typeof v === "string") return v.length >= min;
    if (Array.isArray(v)) return v.length >= min;
    return false;
  },
  maxLength: (args, resolve) => {
    const v = resolve(args.value);
    const max = args.max as number;
    if (typeof v === "string") return v.length <= max;
    if (Array.isArray(v)) return v.length <= max;
    return false;
  },
  min: (args, resolve) => {
    const v = resolve(args.value);
    const min = args.min as number;
    return typeof v === "number" && v >= min;
  },
  max: (args, resolve) => {
    const v = resolve(args.value);
    const max = args.max as number;
    return typeof v === "number" && v <= max;
  },
  email: (args, resolve) => {
    const v = resolve(args.value);
    if (typeof v !== "string") return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(v);
  },
};

const customChecks = new Map<string, ValidationFunction>();

export function registerCheck(name: string, fn: ValidationFunction): void {
  customChecks.set(name, fn);
}

export function runChecks(
  checks: CheckDefinition[],
  resolveValue: (pathOrValue: unknown) => unknown
): { valid: boolean; messages: string[] } {
  const messages: string[] = [];
  for (const check of checks) {
    const fn = customChecks.get(check.call) ?? builtInChecks[check.call];
    if (!fn) continue;
    const valid = fn(check.args ?? {}, resolveValue);
    if (!valid && check.message) {
      messages.push(check.message);
    }
  }
  return {
    valid: messages.length === 0,
    messages,
  };
}
