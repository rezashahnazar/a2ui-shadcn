"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { A2UISurface } from "a2ui-shadcn";
import type { A2UIMessage } from "a2ui-shadcn";
import { MonacoEditor } from "@/components/monaco-editor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { playgroundExamples, getExamplesByCategory, formatPlaygroundJson } from "@/lib/playground-examples";

function parseMessages(json: string): { messages: A2UIMessage[]; error: string | null } {
  try {
    const parsed = JSON.parse(json) as A2UIMessage[];
    if (!Array.isArray(parsed)) return { messages: [], error: "JSON must be an array" };
    const validMessages = parsed.filter((m) => m?.version === "v0.9");
    if (validMessages.length === 0) return { messages: [], error: "No valid v0.9 messages found" };
    return { messages: validMessages, error: null };
  } catch (e) {
    return { messages: [], error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

type ActionLogEntry = {
  id: string;
  name: string;
  sourceComponentId: string;
  context: Record<string, unknown>;
  timestamp: string;
  dataModel?: Record<string, unknown>;
  ts: number;
};

type MobilePanel = "json" | "preview" | "inspector";

const LAYOUT_STORAGE_KEY = "playground-layout";
const INSPECTOR_LAYOUT_KEY = "playground-inspector-layout";

export default function PlaygroundPage() {
  const [json, setJson] = useState(playgroundExamples[0].json);
  const [activeExample, setActiveExample] = useState(playgroundExamples[0].id);
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [dataModelSnapshot, setDataModelSnapshot] = useState<Record<string, unknown>>({});
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("preview");
  const { messages, error } = useMemo(() => parseMessages(json), [json]);
  
  // Load saved layout from localStorage - must run before Group mounts (defaultLayout only applies on first mount)
  const [layoutState, setLayoutState] = useState<{
    main: Record<string, number> | null;
    inspector: Record<string, number> | null;
    ready: boolean;
  }>({ main: null, inspector: null, ready: false });

  useEffect(() => {
    try {
      const layout = localStorage.getItem(LAYOUT_STORAGE_KEY);
      const inspectorLayout = localStorage.getItem(INSPECTOR_LAYOUT_KEY);
      setLayoutState({
        main: layout ? JSON.parse(layout) : null,
        inspector: inspectorLayout ? JSON.parse(inspectorLayout) : null,
        ready: true,
      });
    } catch (e) {
      console.error("Failed to load saved layout:", e);
      setLayoutState((s) => ({ ...s, ready: true }));
    }
  }, []);
  
  const handleLayoutChange = useCallback((layout: Record<string, number>) => {
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    } catch (e) {
      console.error("Failed to save layout:", e);
    }
  }, []);
  
  const handleInspectorLayoutChange = useCallback((layout: Record<string, number>) => {
    try {
      localStorage.setItem(INSPECTOR_LAYOUT_KEY, JSON.stringify(layout));
    } catch (e) {
      console.error("Failed to save inspector layout:", e);
    }
  }, []);

  const examplesByCategory = getExamplesByCategory();
  const currentExample = playgroundExamples.find((ex) => ex.id === activeExample);

  // Extract data model from updateDataModel messages and merge with action snapshots
  const currentDataModel = useMemo(() => {
    const dataModel: Record<string, unknown> = {};
    messages.forEach((msg: any) => {
      if (msg.updateDataModel) {
        const { path, value } = msg.updateDataModel;
        if (path && value !== undefined) {
          // Simple path assignment (could be enhanced for nested paths)
          const pathStr = path.startsWith('/') ? path.slice(1) : path;
          dataModel[pathStr] = value;
        }
      }
    });
    // Merge both sources - action snapshots take precedence
    return { ...dataModel, ...dataModelSnapshot };
  }, [messages, dataModelSnapshot]);

  // Clear action log when example changes
  useEffect(() => {
    setActionLog([]);
    setDataModelSnapshot({});
  }, [activeExample]);

  const handleExampleSelect = (example: (typeof playgroundExamples)[0]) => {
    setJson(example.json);
    setActiveExample(example.id);
    setExamplesOpen(false);
  };

  const handleFormat = () => {
    setJson(formatPlaygroundJson(json));
  };

  const handleAction = useCallback(
    (action: {
      name: string;
      sourceComponentId?: string;
      context?: Record<string, unknown>;
      timestamp?: string;
      dataModel?: Record<string, unknown>;
    }) => {
      const entry: ActionLogEntry = {
        id: `${Date.now()}-${Math.random()}`,
        name: action.name,
        sourceComponentId: action.sourceComponentId ?? "",
        context: action.context ?? {},
        timestamp: action.timestamp ?? new Date().toISOString(),
        dataModel: action.dataModel,
        ts: Date.now(),
      };
      setActionLog((prev) => [entry, ...prev]);
      if (action.dataModel) {
        setDataModelSnapshot(action.dataModel);
      }
    },
    []
  );

  const clearActionLog = () => setActionLog([]);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {/* Compact toolbar */}
      <div 
        className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-muted/20 px-3 py-1.5"
        onClick={(e) => {
          // Close dropdown when clicking anywhere in toolbar except the dropdown itself
          if (examplesOpen && !(e.target as HTMLElement).closest('[data-dropdown]')) {
            setExamplesOpen(false);
          }
        }}
      >
        <div className="relative flex min-w-0 flex-1 items-center gap-3 lg:hidden" data-dropdown>
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Examples
          </span>
          <button
            type="button"
            onClick={() => setExamplesOpen(!examplesOpen)}
            className="relative z-40 flex min-w-0 flex-1 max-w-md items-center justify-between gap-2 rounded border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent active:scale-98"
          >
            <span className="truncate">{currentExample?.name || "Select example"}</span>
            <svg
              className={`size-3.5 shrink-0 transition-transform ${examplesOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {examplesOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setExamplesOpen(false)}
              />
              <div className="absolute start-0 top-full z-40 mt-1 w-[min(20rem,calc(100vw-2rem))] max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-background">
                {Object.entries(examplesByCategory).map(([category, examples]) => (
                  <div key={category} className="border-b border-border last:border-b-0">
                    <div className="sticky top-0 bg-muted/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                      {category}
                    </div>
                    <div className="p-1">
                      {examples.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => handleExampleSelect(ex)}
                        className={`flex w-full cursor-pointer flex-col items-start gap-1 rounded px-3 py-2.5 text-start transition-colors active:scale-98 ${
                          activeExample === ex.id
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent active:bg-accent/70"
                        }`}
                      >
                          <span className="text-sm font-medium">{ex.name}</span>
                          <span className="text-xs text-muted-foreground">{ex.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Playground
          </span>
        </div>
      </div>

      {/* Mobile panel tabs - improved touch targets */}
      <div className="flex shrink-0 gap-0 border-b border-border bg-muted/20 lg:hidden">
        {(["json", "preview", "inspector"] as const).map((panel) => (
          <button
            key={panel}
            type="button"
            onClick={() => setMobilePanel(panel)}
            className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors active:scale-95 ${
              mobilePanel === panel
                ? "border-b-2 border-primary bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground active:bg-accent/50"
            }`}
          >
            {panel === "json" ? "JSON" : panel === "preview" ? "Preview" : "Inspector"}
          </button>
        ))}
      </div>

      {/* Main content - 3-panel resizable layout on desktop, single panel on mobile */}
      {/* Mobile: tabbed single panel */}
      <div className="flex min-h-0 min-w-0 flex-1 gap-0 overflow-hidden lg:hidden">
        <div className={`flex min-w-0 flex-1 flex-col border-e border-border ${mobilePanel !== "json" ? "hidden" : "flex"}`}>
          <div className="flex shrink-0 h-8 items-center justify-between gap-2 border-b border-border bg-muted/50 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">A2UI JSON</span>
            <div className="flex items-center gap-2">
              {error && (
                <span className="text-[10px] text-destructive" title={error}>
                  Invalid JSON
                </span>
              )}
              <button
                type="button"
                onClick={handleFormat}
                className="cursor-pointer shrink-0 rounded border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent active:scale-95 lg:px-2.5 lg:py-1"
              >
                Format JSON
              </button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 p-2">
            <MonacoEditor
              value={json}
              onChange={(value) => setJson(value || "")}
              language="json"
              height="100%"
              readOnly={false}
              className="w-full"
            />
          </div>
        </div>

        {/* Middle: Live Preview */}
        <div className={`flex min-w-0 flex-1 flex-col border-x border-border ${mobilePanel !== "preview" ? "hidden" : "flex"}`}>
          <div className="flex shrink-0 h-8 items-center justify-between border-b border-border bg-muted/50 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Preview</span>
            {!error && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Reactive
              </span>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-4">
            {error ? (
              <div className="flex h-full min-h-[200px] items-center justify-center rounded border border-destructive/30 bg-destructive/5">
                <p className="text-center text-sm text-destructive">{error}</p>
              </div>
            ) : (
              <A2UISurface
                surfaceId="playground"
                messages={messages}
                onAction={handleAction}
                className="min-h-0"
              />
            )}
          </div>
        </div>

        {/* Right: Inspector Panel */}
        <div className={`flex min-w-0 shrink-0 flex-col border-s border-border ${mobilePanel !== "inspector" ? "hidden" : "flex"}`}>
          <div className="flex shrink-0 h-8 items-center border-b border-border bg-muted/50 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inspector</span>
          </div>

          <ResizablePanelGroup 
            orientation="vertical" 
            className="min-h-0 flex-1" 
            id="inspector-sections"
            defaultLayout={layoutState.inspector ?? undefined}
            onLayoutChanged={handleInspectorLayoutChange}
          >
            <ResizablePanel id="actions" defaultSize={33} minSize={15} className="flex flex-col min-h-0">
              <div className="flex shrink-0 h-8 items-center justify-between border-b border-border bg-muted/50 px-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</span>
                {actionLog.length > 0 && (
                  <button
                    type="button"
                    onClick={clearActionLog}
                    className="cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95"
                  >
                    Clear
                  </button>
                )}
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                {actionLog.length === 0 ? (
                  <div className="flex min-h-[120px] items-center justify-center rounded border border-dashed border-border bg-muted/20 p-4 text-center">
                    <p className="text-xs text-muted-foreground">No actions yet. Interact with the UI to see actions here.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {actionLog.map((action) => (
                      <div
                        key={action.id}
                        className="animate-in fade-in slide-in-from-top-1 rounded-lg border border-border bg-card p-2.5 text-[10px]"
                      >
                        <div className="flex items-start justify-between">
                          <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                            {action.name}
                          </code>
                          <span className="text-[9px] text-muted-foreground">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {action.sourceComponentId && (
                          <div className="mt-1 text-muted-foreground">
                            from: <code className="font-mono text-foreground">{action.sourceComponentId}</code>
                          </div>
                        )}
                        {Object.keys(action.context).length > 0 && (
                          <details className="mt-1.5">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              context {Object.keys(action.context).length > 0 && `(${Object.keys(action.context).length})`}
                            </summary>
                            <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-1.5 font-mono text-[9px] leading-tight text-muted-foreground">
                              {JSON.stringify(action.context, null, 2)}
                            </pre>
                          </details>
                        )}
                        {action.dataModel && Object.keys(action.dataModel).length > 0 && (
                          <div className="mt-1 text-muted-foreground">
                            includes dataModel
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle orientation="vertical" />
            <ResizablePanel id="data" defaultSize={33} minSize={15} className="flex flex-col min-h-0">
              <div className="flex shrink-0 h-8 items-center border-b border-border bg-muted/50 px-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data Model</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                {Object.keys(currentDataModel).length === 0 ? (
                  <div className="flex min-h-[80px] items-center justify-center rounded border border-dashed border-border bg-muted/20 p-4 text-center">
                    <p className="text-xs text-muted-foreground">No data model yet. Use updateDataModel messages or trigger actions.</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-card p-3">
                    <pre className="overflow-x-auto font-mono text-[10px] leading-relaxed">
                      {JSON.stringify(currentDataModel, null, 2)}
                    </pre>
                  </div>
                )}
                </div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle orientation="vertical" />
            <ResizablePanel id="timeline" defaultSize={34} minSize={15} className="flex flex-col min-h-0">
              <div className="flex shrink-0 h-8 items-center border-b border-border bg-muted/50 px-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-3">
                {actionLog.length === 0 ? (
                  <div className="flex min-h-[80px] items-center justify-center rounded border border-dashed border-border bg-muted/20 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Timeline will show action → data flow here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {actionLog.slice().reverse().map((action, idx) => (
                      <div key={action.id} className="relative flex gap-2">
                        <div className="flex shrink-0 flex-col items-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background text-[10px] font-bold text-primary">
                            {idx + 1}
                          </div>
                          {idx < actionLog.length - 1 && (
                            <div className="h-full w-0.5 flex-1 bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="rounded-lg border border-border bg-card p-2 text-[10px]">
                            <div className="font-semibold text-foreground">{action.name}</div>
                            <div className="mt-0.5 text-muted-foreground">
                              {new Date(action.timestamp).toLocaleTimeString()}
                            </div>
                            {Object.keys(action.context).length > 0 && (
                              <div className="mt-1 rounded bg-primary/5 px-1.5 py-1 text-[9px] text-primary">
                                resolved {Object.keys(action.context).length} context value(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Desktop: resizable 4-panel layout with examples sidebar - only mount after layout loaded (defaultLayout applies on first mount only) */}
      {!layoutState.ready && (
        <div className="hidden min-h-0 min-w-0 flex-1 items-center justify-center bg-muted/20 lg:flex" aria-hidden>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      )}
      {layoutState.ready && (
      <ResizablePanelGroup
        orientation="horizontal"
        className="hidden min-h-0 min-w-0 flex-1 lg:flex"
        id="playground-panels"
        defaultLayout={layoutState.main ?? undefined}
        onLayoutChanged={handleLayoutChange}
      >
        {/* Examples Sidebar */}
        <ResizablePanel id="examples" defaultSize={240} minSize={180} maxSize={400} className="flex flex-col min-w-0 bg-muted/30">
          <div className="flex shrink-0 h-8 items-center border-b border-border bg-muted/50 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Examples</span>
          </div>
          <ScrollArea className="flex-1">
            {Object.entries(examplesByCategory).map(([category, examples]) => (
              <div key={category} className="border-b border-border/50 last:border-b-0">
                <div className="sticky top-0 bg-muted/80 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                  {category}
                </div>
                <div className="space-y-1 p-2">
                  {examples.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => handleExampleSelect(ex)}
                      className={`flex w-full cursor-pointer flex-col items-start gap-1 rounded-md px-3 py-2.5 text-start transition-colors ${
                        activeExample === ex.id
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <span className="text-xs font-medium leading-snug">{ex.name}</span>
                      <span className="text-[10px] leading-snug text-muted-foreground">{ex.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="json" defaultSize="32" minSize="15" maxSize="50" className="flex flex-col min-w-0">
          <div className="flex shrink-0 h-8 items-center justify-between gap-2 border-b border-border bg-muted/50 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">A2UI JSON</span>
            <div className="flex items-center gap-2">
              {error && (
                <span className="text-[10px] text-destructive" title={error}>
                  Invalid JSON
                </span>
              )}
              <button
                type="button"
                onClick={handleFormat}
                className="cursor-pointer shrink-0 rounded border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent active:scale-95 lg:px-2.5 lg:py-1"
              >
                Format JSON
              </button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 p-2">
            <MonacoEditor
              value={json}
              onChange={(value) => setJson(value || "")}
              language="json"
              height="100%"
              readOnly={false}
              className="w-full"
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="preview" defaultSize="28" minSize="20" maxSize="60" className="flex flex-col min-w-0">
          <div className="flex shrink-0 h-8 items-center justify-between border-b border-border bg-muted/50 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Preview</span>
            {!error && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Reactive
              </span>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-4">
            {error ? (
              <div className="flex h-full min-h-[200px] items-center justify-center rounded border border-destructive/30 bg-destructive/5">
                <p className="text-center text-sm text-destructive">{error}</p>
              </div>
            ) : (
              <A2UISurface
                surfaceId="playground"
                messages={messages}
                onAction={handleAction}
                className="min-h-0"
              />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="inspector" defaultSize={280} minSize={240} maxSize="40" className="flex flex-col min-w-0">
          <div className="flex shrink-0 h-8 items-center border-b border-border bg-muted/50 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inspector</span>
          </div>
          <ResizablePanelGroup 
            orientation="vertical" 
            className="min-h-0 flex-1" 
            id="inspector-sections-desktop"
            defaultLayout={layoutState.inspector ?? undefined}
            onLayoutChanged={handleInspectorLayoutChange}
          >
            <ResizablePanel id="actions" defaultSize={33} minSize={15} className="flex flex-col min-h-0">
              <div className="flex shrink-0 h-8 items-center justify-between border-b border-border bg-muted/50 px-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</span>
                {actionLog.length > 0 && (
                  <button
                    type="button"
                    onClick={clearActionLog}
                    className="cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95"
                  >
                    Clear
                  </button>
                )}
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                {actionLog.length === 0 ? (
                  <div className="flex min-h-[80px] items-center justify-center rounded border border-dashed border-border bg-muted/20 p-4 text-center">
                    <p className="text-xs text-muted-foreground">No actions yet. Interact with the UI to see actions here.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {actionLog.map((action) => (
                      <div
                        key={action.id}
                        className="animate-in fade-in slide-in-from-top-1 rounded-lg border border-border bg-card p-2.5 text-[10px]"
                      >
                        <div className="flex items-start justify-between">
                          <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                            {action.name}
                          </code>
                          <span className="text-[9px] text-muted-foreground">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {action.sourceComponentId && (
                          <div className="mt-1 text-muted-foreground">
                            from: <code className="font-mono text-foreground">{action.sourceComponentId}</code>
                          </div>
                        )}
                        {Object.keys(action.context).length > 0 && (
                          <details className="mt-1.5">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              context {Object.keys(action.context).length > 0 && `(${Object.keys(action.context).length})`}
                            </summary>
                            <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-1.5 font-mono text-[9px] leading-tight text-muted-foreground">
                              {JSON.stringify(action.context, null, 2)}
                            </pre>
                          </details>
                        )}
                        {action.dataModel && Object.keys(action.dataModel).length > 0 && (
                          <div className="mt-1 text-muted-foreground">
                            includes dataModel
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle orientation="vertical" />
            <ResizablePanel id="data" defaultSize={33} minSize={15} className="flex flex-col min-h-0">
              <div className="flex shrink-0 h-8 items-center border-b border-border bg-muted/50 px-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data Model</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                {Object.keys(currentDataModel).length === 0 ? (
                  <div className="flex min-h-[80px] items-center justify-center rounded border border-dashed border-border bg-muted/20 p-4 text-center">
                    <p className="text-xs text-muted-foreground">No data model yet. Use updateDataModel messages or trigger actions.</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-card p-3">
                    <pre className="overflow-x-auto font-mono text-[10px] leading-relaxed">
                      {JSON.stringify(currentDataModel, null, 2)}
                    </pre>
                  </div>
                )}
                </div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle orientation="vertical" />
            <ResizablePanel id="timeline" defaultSize={34} minSize={15} className="flex flex-col min-h-0">
              <div className="flex shrink-0 h-8 items-center border-b border-border bg-muted/50 px-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-3">
                {actionLog.length === 0 ? (
                  <div className="flex min-h-[80px] items-center justify-center rounded border border-dashed border-border bg-muted/20 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Timeline will show action → data flow here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {actionLog.slice().reverse().map((action, idx) => (
                      <div key={action.id} className="relative flex gap-2">
                        <div className="flex shrink-0 flex-col items-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background text-[10px] font-bold text-primary">
                            {idx + 1}
                          </div>
                          {idx < actionLog.length - 1 && (
                            <div className="h-full w-0.5 flex-1 bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="rounded-lg border border-border bg-card p-2 text-[10px]">
                            <div className="font-semibold text-foreground">{action.name}</div>
                            <div className="mt-0.5 text-muted-foreground">
                              {new Date(action.timestamp).toLocaleTimeString()}
                            </div>
                            {Object.keys(action.context).length > 0 && (
                              <div className="mt-1 rounded bg-primary/5 px-1.5 py-1 text-[9px] text-primary">
                                resolved {Object.keys(action.context).length} context value(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      )}
    </div>
  );
}
