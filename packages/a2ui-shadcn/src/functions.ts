/**
 * Client-side function registry for functionCall actions
 * and context-resolution functions (return values for action context)
 */

export type FunctionHandler = (args: Record<string, unknown>) => void | Promise<void>;

/** Context functions return a value used when resolving action context (e.g. formatDate) */
export type ContextFunctionHandler = (args: Record<string, unknown>) => unknown;

const functions = new Map<string, FunctionHandler>();
const contextFunctions = new Map<string, ContextFunctionHandler>();

export function registerFunction(name: string, handler: FunctionHandler): void {
  functions.set(name, handler);
}

export function getFunction(name: string): FunctionHandler | undefined {
  return functions.get(name);
}

/** Register a function that returns a value for use in action context resolution */
export function registerContextFunction(
  name: string,
  handler: ContextFunctionHandler
): void {
  contextFunctions.set(name, handler);
}

export function getContextFunction(name: string): ContextFunctionHandler | undefined {
  return contextFunctions.get(name);
}

export async function executeFunction(
  name: string,
  args: Record<string, unknown>
): Promise<void> {
  const handler = getFunction(name);
  if (handler) {
    await handler(args);
  }
}

/** Execute a context function and return its value (for resolving action.context) */
export function executeContextFunction(
  name: string,
  args: Record<string, unknown>
): unknown {
  const handler = getContextFunction(name);
  return handler ? handler(args) : undefined;
}

// Built-in action functions (void)
registerFunction("openUrl", ({ url }: { url?: string }) => {
  if (typeof url === "string") window.open(url, "_blank");
});

registerFunction("showAlert", ({ message }: { message?: string }) => {
  alert(message ?? "");
});

// Built-in context functions (return value for action context)
registerContextFunction("formatDate", ({ value, format }: Record<string, unknown>) => {
  const dateValue = value == null ? new Date() : new Date(String(value));
  if (Number.isNaN(dateValue.getTime())) return String(value);
  const fmt = typeof format === "string" ? format : "PPp";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: fmt.includes("Y") && fmt.includes("M") ? "medium" : undefined,
      timeStyle: fmt.includes("h") || fmt.includes("a") ? "short" : undefined,
    }).format(dateValue);
  } catch {
    return dateValue.toISOString();
  }
});
