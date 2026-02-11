/**
 * A2UI Component Adapters - map A2UI components to UI primitives
 * Compatible with shadcn/ui styling (Tailwind-based)
 */

import React from "react";
import type { ComponentAdapterProps, A2UIComponent } from "../types";
import { resolveValue, isPathBinding } from "../utils";
import { runChecks } from "../validation";
import { executeFunction, executeContextFunction } from "../functions";

/** Base resolve helper for adapter props */
function createResolve(props: ComponentAdapterProps) {
  return <T,>(binding: unknown, fallback: T): T => {
    if (binding === undefined || binding === null) return fallback;
    if (isPathBinding(binding)) {
      const value = props.dataModel.get((binding as { path: string }).path);
      return (value !== undefined ? value : fallback) as T;
    }
    return binding as T;
  };
}

/** Check if value is a FunctionCall ref (call + optional args/returnType) */
function isFunctionCallRef(v: unknown): v is { call: string; args?: Record<string, unknown>; returnType?: string } {
  return (
    v != null &&
    typeof v === "object" &&
    "call" in v &&
    typeof (v as { call: unknown }).call === "string"
  );
}

/** Resolve a single context value: path binding, FunctionCall, nested object, or literal */
function resolveContextValue(
  v: unknown,
  resolve: ComponentAdapterProps["resolveValue"]
): unknown {
  if (v === undefined || v === null) return v;
  if (isPathBinding(v)) return resolve(v, undefined);
  if (isFunctionCallRef(v)) {
    const args = v.args ? resolveContext(v.args, resolve) : {};
    return executeContextFunction(v.call, args as Record<string, unknown>);
  }
  if (typeof v === "object" && !Array.isArray(v) && v !== null) {
    return resolveContext(v as Record<string, unknown>, resolve);
  }
  return v;
}

/** Recursively resolve action context: path bindings and FunctionCalls to current values */
function resolveContext(
  context: Record<string, unknown> | undefined,
  resolve: ComponentAdapterProps["resolveValue"]
): Record<string, unknown> {
  if (!context) return {};
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(context)) {
    result[k] = resolveContextValue(v, resolve);
  }
  return result;
}

export function ButtonAdapter(props: ComponentAdapterProps) {
  const { component, children, onAction, surfaceId, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const text = resolve(component.text ?? component.label, "");
  const disabled = resolve(component.disabled, false) as boolean;
  const variant = (component.variant ?? "primary") as string;
  const size = (component.size ?? "md") as string;

  const checks = (component.checks ?? []) as Array<{ call: string; args?: Record<string, unknown>; message?: string }>;
  const checkResult = runChecks(checks, (v) => resolve(v, undefined));
  const isDisabled = disabled || !checkResult.valid;

  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variantClass =
    variant === "secondary"
      ? "border border-input bg-secondary text-secondary-foreground hover:bg-secondary/80"
      : variant === "outline"
        ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        : variant === "ghost"
          ? "hover:bg-accent hover:text-accent-foreground"
          : variant === "destructive"
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90";
  const sizeClass =
    size === "sm" ? "h-8 px-3 text-sm" : size === "lg" ? "h-11 px-8 text-base" : "h-9 px-4 text-sm";

  const handleClick = () => {
    if (isDisabled) return;
    const action = component.action as { event?: { name: string; context?: Record<string, unknown> }; functionCall?: { call: string; args?: Record<string, unknown> } };
    if (action?.event) {
      const ctx = resolveContext(action.event.context, rv);
      onAction({
        surfaceId,
        sourceComponentId: component.id,
        name: action.event.name,
        context: ctx,
        timestamp: new Date().toISOString(),
      });
    } else if (action?.functionCall) {
      const args = action.functionCall.args
        ? resolveContext(action.functionCall.args as Record<string, unknown>, rv)
        : {};
      executeFunction(action.functionCall.call, args as Record<string, unknown>);
    }
  };

  return (
    <button
      type="button"
      className={`${baseClass} ${variantClass} ${sizeClass}`}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {children ?? text}
    </button>
  );
}

export function TextAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const text = resolve(component.text ?? component.content, "") as string;
  const variant = (component.variant ?? component.usageHint ?? "body") as string;
  const tone = (component.tone ?? "default") as string;

  const tag: "h1" | "h2" | "h3" | "p" | "span" =
    variant === "h1" || variant === "heading1" ? "h1" : variant === "h2" || variant === "heading2" ? "h2" : variant === "h3" || variant === "heading3" ? "h3" : variant === "caption" ? "span" : "p";
  const sizeClass =
    variant === "h1" || variant === "heading1"
      ? "text-3xl font-bold tracking-tight"
      : variant === "h2" || variant === "heading2"
        ? "text-2xl font-semibold tracking-tight"
        : variant === "h3" || variant === "heading3"
          ? "text-xl font-semibold"
          : variant === "caption"
            ? "text-sm text-muted-foreground"
            : "text-base";
  const toneClass =
    tone === "muted" ? "text-muted-foreground" : tone === "success" ? "text-green-600 dark:text-green-400" : tone === "error" ? "text-destructive" : "";

  return React.createElement(tag, { className: `${sizeClass} ${toneClass}` }, text);
}

export function ColumnAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  const gap = (component.gap ?? "md") as string;
  const align = (component.align ?? "stretch") as string;
  const justify = (component.justify ?? "start") as string;
  const customClass = (component.className as string) ?? "";

  const gapClass = gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4";
  const alignClass = align === "center" ? "items-center" : align === "end" ? "items-end" : align === "start" ? "items-start" : "items-stretch";
  const justifyClass = justify === "center" ? "justify-center" : justify === "end" ? "justify-end" : justify === "spaceBetween" ? "justify-between" : "justify-start";

  return (
    <div className={`flex flex-col ${gapClass} ${alignClass} ${justifyClass} ${customClass}`.trim()}>
      {children}
    </div>
  );
}

export function RowAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  const gap = (component.gap ?? "md") as string;
  const align = (component.align ?? "center") as string;
  const justify = (component.justify ?? "start") as string;
  const customClass = (component.className as string) ?? "";

  const gapClass = gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4";
  const alignClass = align === "center" ? "items-center" : align === "end" ? "items-end" : "items-stretch";
  const justifyClass = justify === "center" ? "justify-center" : justify === "end" ? "justify-end" : justify === "spaceBetween" ? "justify-between" : "justify-start";

  return (
    <div className={`flex flex-row ${gapClass} ${alignClass} ${justifyClass} ${customClass}`.trim()}>
      {children}
    </div>
  );
}

export function BoxAdapter(props: ComponentAdapterProps) {
  const { children } = props;
  return <div>{children}</div>;
}

export function CardAdapter(props: ComponentAdapterProps) {
  const { children } = props;
  return (
    <div className="flex flex-col gap-0 rounded-lg border border-border bg-card text-card-foreground overflow-hidden">
      {children}
    </div>
  );
}

export function DividerAdapter(props: ComponentAdapterProps) {
  const axis = (props.component.axis ?? "horizontal") as string;
  return (
    <div
      className={axis === "vertical" ? "w-px self-stretch bg-border" : "h-px w-full bg-border"}
      role="separator"
    />
  );
}

export function TextFieldAdapter(props: ComponentAdapterProps) {
  const { component, dataModel, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const label = resolve(component.label, "") as string;
  const placeholder = resolve(component.placeholder, "") as string;
  const path = (component.value as { path?: string })?.path;
  const value = path ? (dataModel.get(path) as string) ?? "" : (resolve(component.value, "") as string);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (path) dataModel.set(path, e.target.value);
  };

  return (
    <div className="grid gap-2">
      {label && (
        <label className="text-sm font-medium leading-none">{label}</label>
      )}
      <input
        type="text"
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export function CheckBoxAdapter(props: ComponentAdapterProps) {
  const { component, dataModel, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const label = resolve(component.label, "") as string;
  const binding = (component.checked ?? component.value) as { path?: string } | boolean | undefined;
  const path = typeof binding === "object" && binding?.path ? binding.path : undefined;
  const checked = path ? (dataModel.get(path) as boolean) ?? false : (resolve(binding, false) as boolean);

  const handleChange = () => {
    if (path) dataModel.set(path, !checked);
  };

  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-input"
        checked={checked}
        onChange={handleChange}
      />
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

export function ImageAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const src = resolve(component.src ?? component.url, "") as string;
  const alt = resolve(component.alt, "") as string;

  if (!src) return null;
  return <img src={src} alt={alt ?? ""} className="max-w-full rounded-md" />;
}

export function LinkAdapter(props: ComponentAdapterProps) {
  const { component, children, onAction, surfaceId, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const href = resolve(component.href ?? component.url, "#") as string;
  const text = resolve(component.text ?? component.label, "") as string;

  const action = component.action as { event?: { name: string; context?: Record<string, unknown> } };
  const handleClick = (e: React.MouseEvent) => {
    if (action?.event) {
      e.preventDefault();
      const ctx = resolveContext(action.event.context, rv);
      onAction({
        surfaceId,
        sourceComponentId: component.id,
        name: action.event.name,
        context: ctx,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <a
      href={href}
      onClick={action?.event ? handleClick : undefined}
      className="text-primary underline underline-offset-4 hover:no-underline"
    >
      {children ?? text}
    </a>
  );
}

export function BadgeAdapter(props: ComponentAdapterProps) {
  const { component, children, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const text = resolve(component.text ?? component.label, "") as string;
  const variant = (component.variant ?? "default") as string;
  const size = (component.size ?? "md") as string;

  const variantClass =
    variant === "secondary"
      ? "bg-secondary text-secondary-foreground border border-border"
      : variant === "destructive"
        ? "bg-destructive/10 text-destructive border border-destructive/30"
        : variant === "outline"
          ? "border border-input bg-background text-foreground"
          : variant === "success"
            ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30"
            : "bg-primary/10 text-primary border border-primary/30";

  const sizeClass =
    size === "sm"
      ? "px-2 py-0.5 text-[10px]"
      : size === "lg"
        ? "px-4 py-1.5 text-sm"
        : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold transition-colors ${variantClass} ${sizeClass}`}
    >
      {children ?? text}
    </span>
  );
}

export function ProgressIndicatorAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const value = resolve(component.value ?? component.progress, 0) as number;
  const max = resolve(component.max, 100) as number;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function MarkdownAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const source = resolve(component.source ?? component.text ?? component.content, "") as string;

  if (!source) return null;
  // Simple markdown: bold, italic, links, headers. Full implementation would use a library.
  const html = source
    .replace(/^### (.*$)/gm, "<h3 class='text-lg font-semibold mt-4'>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2 class='text-xl font-semibold mt-4'>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1 class='text-2xl font-bold mt-4'>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline">$1</a>');

  return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function CodeBlockAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const code = resolve(component.code ?? component.text ?? component.content, "") as string;
  const language = (component.language ?? "text") as string;

  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-sm">
      <code>{code}</code>
    </pre>
  );
}

export function IconAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const name = resolve(component.name ?? component.icon, "") as string;
  const size = (component.size ?? 24) as number;

  // Placeholder: render a simple icon box. Consumer can override with actual icon library.
  return (
    <span
      className="inline-flex items-center justify-center rounded"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l2 2" />
      </svg>
    </span>
  );
}

export function SwitchAdapter(props: ComponentAdapterProps) {
  const { component, dataModel, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const label = resolve(component.label, "") as string;
  const path = (component.value as { path?: string })?.path;
  const checked = path ? (dataModel.get(path) as boolean) ?? false : (resolve(component.value, false) as boolean);

  const handleChange = () => {
    if (path) dataModel.set(path, !checked);
  };

  return (
    <label className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          checked ? "bg-primary" : "bg-input"
        }`}
      >
        <span
          className={`pointer-events-none block h-5 w-5 rounded-full bg-background ring-0 transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

export function SliderAdapter(props: ComponentAdapterProps) {
  const { component, dataModel, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const path = (component.value as { path?: string })?.path;
  const value = path ? (dataModel.get(path) as number) ?? 0 : (resolve(component.value, 0) as number);
  const min = resolve(component.min, 0) as number;
  const max = resolve(component.max, 100) as number;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (path) dataModel.set(path, Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full"
      />
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  );
}

export function ChoicePickerAdapter(props: ComponentAdapterProps) {
  const { component, dataModel, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const path = (component.value as { path?: string })?.path;
  const selected = path ? (dataModel.get(path) as string | string[]) : (resolve(component.value, "") as string | string[]);
  const options = (component.options ?? []) as Array<{ label: string; value: string }>;
  const variant = (component.variant ?? "mutuallyExclusive") as string;

  const handleChange = (optValue: string) => {
    if (!path) return;
    if (variant === "mutuallyExclusive") {
      dataModel.set(path, optValue);
    } else {
      const arr = Array.isArray(selected) ? [...selected] : selected ? [selected] : [];
      const idx = arr.indexOf(optValue);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(optValue);
      dataModel.set(path, arr);
    }
  };

  const isSelected = (v: string) =>
    Array.isArray(selected) ? selected.includes(v) : selected === v;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleChange(opt.value)}
          className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
            isSelected(opt.value)
              ? "border-primary bg-primary/10 text-primary"
              : "border-input hover:bg-accent"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function AccordionAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  return (
    <div className="border-b border-border">
      {children}
    </div>
  );
}

export function TabsAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  return <div className="w-full">{children}</div>;
}

export function ListAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  return (
    <ul className="list-disc space-y-2 ps-6">
      {children}
    </ul>
  );
}

export function DataTableAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const columns = (component.columns ?? []) as Array<{ key: string; header?: string }>;
  const data = resolve(component.data ?? component.items, []) as Record<string, unknown>[];

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-start font-medium">
                {col.header ?? col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-border">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AppBarAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b border-border bg-background px-4">
      {children}
    </header>
  );
}

export function SnackbarAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const message = resolve(component.message ?? component.text, "") as string;
  const open = resolve(component.open ?? component.visible, true) as boolean;

  if (!open || !message) return null;
  return (
    <div className="fixed bottom-4 start-4 z-50 rounded-md border border-border bg-card px-4 py-3 text-sm">
      {message}
    </div>
  );
}

// Placeholder adapters for components not yet fully implemented
export function VideoAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const src = resolve(component.src ?? component.url, "") as string;
  if (!src) return null;
  return <video src={src} controls className="max-w-full rounded-md" />;
}

export function AudioAdapter(props: ComponentAdapterProps) {
  const { component, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const src = resolve(component.src ?? component.url, "") as string;
  if (!src) return null;
  return <audio src={src} controls className="w-full" />;
}

export function DateTimeInputAdapter(props: ComponentAdapterProps) {
  const { component, dataModel, resolveValue: rv } = props;
  const resolve = createResolve(props);
  const path = (component.value as { path?: string })?.path;
  const value = path ? (dataModel.get(path) as string) ?? "" : (resolve(component.value, "") as string);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (path) dataModel.set(path, e.target.value);
  };

  return (
    <input
      type="datetime-local"
      value={value}
      onChange={handleChange}
      className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
    />
  );
}

export function FileUploadAdapter(props: ComponentAdapterProps) {
  const { component } = props;
  return (
    <div className="flex flex-col gap-2">
      <input type="file" className="text-sm" />
    </div>
  );
}

export function MenuAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  return <div className="relative">{children}</div>;
}

export function NavigationDrawerAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  return <nav className="flex flex-col border-e border-border p-4">{children}</nav>;
}

export function BottomNavigationAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  return (
    <nav className="fixed bottom-0 start-0 end-0 flex border-t border-border bg-background p-2">
      {children}
    </nav>
  );
}

export function CarouselAdapter(props: ComponentAdapterProps) {
  const { component, children } = props;
  return <div className="overflow-x-auto">{children}</div>;
}

/** Default component registry */
export const defaultRegistry: Record<string, (props: ComponentAdapterProps) => React.ReactNode> = {
  Button: ButtonAdapter,
  Text: TextAdapter,
  Column: ColumnAdapter,
  Row: RowAdapter,
  Box: BoxAdapter,
  Card: CardAdapter,
  Divider: DividerAdapter,
  TextField: TextFieldAdapter,
  CheckBox: CheckBoxAdapter,
  Image: ImageAdapter,
  Link: LinkAdapter,
  Badge: BadgeAdapter,
  ProgressIndicator: ProgressIndicatorAdapter,
  Markdown: MarkdownAdapter,
  CodeBlock: CodeBlockAdapter,
  Icon: IconAdapter,
  Switch: SwitchAdapter,
  Slider: SliderAdapter,
  ChoicePicker: ChoicePickerAdapter,
  Accordion: AccordionAdapter,
  Tabs: TabsAdapter,
  List: ListAdapter,
  DataTable: DataTableAdapter,
  AppBar: AppBarAdapter,
  Snackbar: SnackbarAdapter,
  Video: VideoAdapter,
  Audio: AudioAdapter,
  DateTimeInput: DateTimeInputAdapter,
  FileUpload: FileUploadAdapter,
  Menu: MenuAdapter,
  NavigationDrawer: NavigationDrawerAdapter,
  BottomNavigation: BottomNavigationAdapter,
  Carousel: CarouselAdapter,
};
