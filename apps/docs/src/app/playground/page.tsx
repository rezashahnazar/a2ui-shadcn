"use client";

import { useState, useMemo, useCallback } from "react";
import { A2UISurface } from "a2ui-shadcn";
import type { A2UIMessage } from "a2ui-shadcn";
import { MonacoEditor } from "@/components/monaco-editor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { playgroundExamples, getExamplesByCategory, formatPlaygroundJson } from "@/lib/playground-examples";
import { useIsDesktop } from "@/lib/use-media-query";

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

type MobileBottomTab = "json" | "inspector";

const LAYOUT_STORAGE_KEY = "playground-layout";
const INSPECTOR_LAYOUT_KEY = "playground-inspector-layout";

/* ---- Extracted components (outside render to avoid re-creation) ---- */

function DesktopInspector({
  actionLog,
  clearActionLog,
  currentDataModel,
  layoutState,
  onLayoutChanged,
}: {
  actionLog: ActionLogEntry[];
  clearActionLog: () => void;
  currentDataModel: Record<string, unknown>;
  layoutState: Record<string, number> | null;
  onLayoutChanged: (layout: Record<string, number>) => void;
}) {
  return (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-0 flex-1"
      id="inspector-sections-desktop"
      defaultLayout={layoutState ?? undefined}
      onLayoutChanged={onLayoutChanged}
    >
      <ResizablePanel id="actions" defaultSize={33} minSize={15} className="flex flex-col min-h-0">
        <div className="flex shrink-0 h-8 items-center justify-between border-b border-border bg-muted/50 px-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</span>
          {actionLog.length > 0 && (
            <button type="button" onClick={clearActionLog} className="cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95">Clear</button>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {actionLog.length === 0 ? (
              <div className="flex min-h-[80px] items-center justify-center rounded border border-dashed border-border bg-muted/20 p-4 text-center">
                <p className="text-xs text-muted-foreground">No actions yet. Interact with the UI to see actions here.</p>
              </div>
            ) : (
              actionLog.map((action) => (
                <div key={action.id} className="animate-in fade-in slide-in-from-top-1 rounded-lg border border-border bg-card p-2.5 text-[10px]">
                  <div className="flex items-start justify-between">
                    <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary">{action.name}</code>
                    <span className="text-[9px] text-muted-foreground">{new Date(action.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {action.sourceComponentId && (
                    <div className="mt-1 text-muted-foreground">from: <code className="font-mono text-foreground">{action.sourceComponentId}</code></div>
                  )}
                  {Object.keys(action.context).length > 0 && (
                    <details className="mt-1.5">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">context ({Object.keys(action.context).length})</summary>
                      <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-1.5 font-mono text-[9px] leading-tight text-muted-foreground">{JSON.stringify(action.context, null, 2)}</pre>
                    </details>
                  )}
                  {action.dataModel && Object.keys(action.dataModel).length > 0 && (
                    <div className="mt-1 text-muted-foreground">includes dataModel</div>
                  )}
                </div>
              ))
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
                <p className="text-xs text-muted-foreground">No data model yet.</p>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-3">
                <pre className="overflow-x-auto font-mono text-[10px] leading-relaxed">{JSON.stringify(currentDataModel, null, 2)}</pre>
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
              actionLog.slice().reverse().map((action, idx) => (
                <div key={action.id} className="relative flex gap-2">
                  <div className="flex shrink-0 flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background text-[10px] font-bold text-primary">{idx + 1}</div>
                    {idx < actionLog.length - 1 && <div className="h-full w-0.5 flex-1 bg-border" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="rounded-lg border border-border bg-card p-2 text-[10px]">
                      <div className="font-semibold text-foreground">{action.name}</div>
                      <div className="mt-0.5 text-muted-foreground">{new Date(action.timestamp).toLocaleTimeString()}</div>
                      {Object.keys(action.context).length > 0 && (
                        <div className="mt-1 rounded bg-primary/5 px-1.5 py-1 text-[9px] text-primary">resolved {Object.keys(action.context).length} context value(s)</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function MobileInspector({
  actionLog,
  currentDataModel,
}: {
  actionLog: ActionLogEntry[];
  currentDataModel: Record<string, unknown>;
}) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-3">
        <details className="rounded-lg border border-border bg-card" open>
          <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-foreground">
            Actions {actionLog.length > 0 && `(${actionLog.length})`}
          </summary>
          <div className="border-t border-border p-2 space-y-2">
            {actionLog.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">No actions yet. Interact with the UI.</p>
            ) : (
              actionLog.map((action) => (
                <div key={action.id} className="rounded border border-border bg-muted/20 p-2.5 text-[11px]">
                  <div className="flex justify-between">
                    <code className="font-semibold text-primary">{action.name}</code>
                    <span className="text-muted-foreground">{new Date(action.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {Object.keys(action.context).length > 0 && (
                    <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-1.5 font-mono text-[9px]">{JSON.stringify(action.context, null, 2)}</pre>
                  )}
                </div>
              ))
            )}
          </div>
        </details>
        <details className="rounded-lg border border-border bg-card">
          <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-foreground">Data Model</summary>
          <div className="border-t border-border p-2">
            {Object.keys(currentDataModel).length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">No data model yet.</p>
            ) : (
              <pre className="overflow-x-auto rounded bg-muted/50 p-2 font-mono text-[10px]">{JSON.stringify(currentDataModel, null, 2)}</pre>
            )}
          </div>
        </details>
        <details className="rounded-lg border border-border bg-card">
          <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-foreground">Timeline</summary>
          <div className="border-t border-border p-2 space-y-2">
            {actionLog.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">Timeline will show action flow.</p>
            ) : (
              actionLog.slice().reverse().map((action, idx) => (
                <div key={action.id} className="flex gap-2 rounded border border-border bg-muted/20 p-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary text-[10px] font-bold text-primary">{idx + 1}</span>
                  <div>
                    <div className="font-medium text-foreground">{action.name}</div>
                    <div className="text-[10px] text-muted-foreground">{new Date(action.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </details>
      </div>
    </ScrollArea>
  );
}

export default function PlaygroundPage() {
  const [json, setJson] = useState(playgroundExamples[0].json);
  const [activeExample, setActiveExample] = useState(playgroundExamples[0].id);
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [dataModelSnapshot, setDataModelSnapshot] = useState<Record<string, unknown>>({});
  const [examplesSheetOpen, setExamplesSheetOpen] = useState(false);
  const [mobileBottomTab, setMobileBottomTab] = useState<MobileBottomTab>("json");
  const isDesktop = useIsDesktop();
  const { messages, error } = useMemo(() => parseMessages(json), [json]);

  // Load saved layout from localStorage via lazy initializer (avoids effect + cascading render)
  const [layoutState] = useState<{
    main: Record<string, number> | null;
    inspector: Record<string, number> | null;
  }>(() => {
    if (typeof window === "undefined") return { main: null, inspector: null };
    try {
      const layout = localStorage.getItem(LAYOUT_STORAGE_KEY);
      const inspectorLayout = localStorage.getItem(INSPECTOR_LAYOUT_KEY);
      return {
        main: layout ? JSON.parse(layout) : null,
        inspector: inspectorLayout ? JSON.parse(inspectorLayout) : null,
      };
    } catch {
      return { main: null, inspector: null };
    }
  });

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages.forEach((msg: any) => {
      if (msg.updateDataModel) {
        const { path, value } = msg.updateDataModel;
        if (path && value !== undefined) {
          const pathStr = path.startsWith("/") ? path.slice(1) : path;
          dataModel[pathStr] = value;
        }
      }
    });
    return { ...dataModel, ...dataModelSnapshot };
  }, [messages, dataModelSnapshot]);

  const handleExampleSelect = (example: (typeof playgroundExamples)[0]) => {
    setJson(example.json);
    setActiveExample(example.id);
    setActionLog([]);
    setDataModelSnapshot({});
    setExamplesSheetOpen(false);
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
      {/* Mobile layout: resizable Preview / Bottom + example bar at bottom */}
      {!isDesktop && (
        <>
          {/* Vertical resizable: Preview (top) | JSON/Inspector (bottom) */}
          <ResizablePanelGroup
            orientation="vertical"
            className="flex min-h-0 flex-1"
            id="mobile-playground"
          >
            {/* Preview panel */}
            <ResizablePanel id="mobile-preview" defaultSize={55} minSize={25} className="flex flex-col min-h-0">
              <div className="flex shrink-0 items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">Playground</span>
                  <span className="text-[10px] text-muted-foreground">/</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Preview</span>
                </div>
                {!error && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                    Reactive
                  </span>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-2">
                <div className="preview-compact rounded-lg border border-dashed border-border min-h-full p-3">
                  {error ? (
                    <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5">
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
            </ResizablePanel>

            <ResizableHandle withHandle orientation="vertical" />

            {/* Bottom panel: JSON / Inspector tabs */}
            <ResizablePanel id="mobile-bottom" defaultSize={45} minSize={20} className="flex flex-col min-h-0">
              {/* Tab bar */}
              <div className="flex shrink-0 items-center gap-1 border-b border-border bg-muted/30 px-2">
                {(["json", "inspector"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMobileBottomTab(tab)}
                    className={`px-3 py-2 text-xs font-medium transition-all active:scale-[0.98] ${
                      mobileBottomTab === tab
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "json" ? "JSON" : "Inspector"}
                  </button>
                ))}
                {mobileBottomTab === "json" && (
                  <div className="ms-auto flex items-center gap-2">
                    {error && (
                      <span className="text-[10px] text-destructive">Invalid</span>
                    )}
                    <button
                      type="button"
                      onClick={handleFormat}
                      className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent active:scale-[0.98]"
                    >
                      Format
                    </button>
                  </div>
                )}
                {mobileBottomTab === "inspector" && actionLog.length > 0 && (
                  <button
                    type="button"
                    onClick={clearActionLog}
                    className="ms-auto rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Tab content */}
              <div className="min-h-0 flex-1 overflow-hidden">
                {mobileBottomTab === "json" && (
                  <div className="h-full p-2">
                    <MonacoEditor
                      value={json}
                      onChange={(value) => setJson(value || "")}
                      language="json"
                      height="100%"
                      readOnly={false}
                      className="h-full w-full"
                    />
                  </div>
                )}
                {mobileBottomTab === "inspector" && (
                  <MobileInspector actionLog={actionLog} currentDataModel={currentDataModel} />
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* Example picker — pinned to bottom, opens bottom sheet */}
          <div className="z-20 shrink-0 border-t border-border bg-background/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
            <Sheet open={examplesSheetOpen} onOpenChange={setExamplesSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="group flex w-full items-center gap-3 rounded-xl bg-muted/50 px-3.5 py-2.5 text-left transition-colors hover:bg-muted active:scale-[0.98]"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{currentExample?.name || "Select example"}</div>
                    <div className="text-[10px] text-muted-foreground">Tap to browse examples</div>
                  </div>
                  <svg className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="flex h-[85dvh] max-h-[600px] w-full flex-col overflow-hidden rounded-t-2xl">
                <SheetHeader className="border-b border-border pb-3 shrink-0">
                  <SheetTitle className="text-base">Browse Examples</SheetTitle>
                </SheetHeader>
                <ScrollArea className="min-h-0 min-w-0 flex-1 py-3">
                  <div className="min-w-0">
                    {Object.entries(examplesByCategory).map(([category, examples]) => (
                      <div key={category} className="mb-5 last:mb-2">
                      <div className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {category}
                      </div>
                      <div className="space-y-1 px-2">
                        {examples.map((ex) => (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => handleExampleSelect(ex)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-start transition-colors active:scale-[0.98] ${
                              activeExample === ex.id
                                ? "bg-primary/10"
                                : "hover:bg-accent active:bg-accent/70"
                            }`}
                          >
                            <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                              activeExample === ex.id
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {ex.name.charAt(0)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={`truncate text-sm font-medium ${
                                activeExample === ex.id ? "text-primary" : "text-foreground"
                              }`}>{ex.name}</div>
                              <div className="truncate text-xs text-muted-foreground">{ex.description}</div>
                            </div>
                            {activeExample === ex.id && (
                              <svg className="size-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </>
      )}

      {/* Desktop toolbar */}
      {isDesktop && (
        <div className="shrink-0 border-b border-border bg-muted/20 px-3 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">Playground</span>
        </div>
      )}

      {/* Desktop: resizable 4-panel layout - only when desktop */}
      {isDesktop && (
        <ResizablePanelGroup
          orientation="horizontal"
          className="flex min-h-0 min-w-0 flex-1"
          id="playground-panels"
          defaultLayout={layoutState.main ?? undefined}
          onLayoutChanged={handleLayoutChange}
        >
          <ResizablePanel id="examples" defaultSize="16" minSize="10" maxSize="25" className="flex flex-col min-w-0 bg-muted/30">
            <div className="flex shrink-0 h-8 items-center border-b border-border bg-muted/50 px-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Examples</span>
            </div>
            <ScrollArea className="flex-1 py-1">
              {Object.entries(examplesByCategory).map(([category, examples]) => (
                <div key={category} className="mb-3 last:mb-1">
                  <div className="sticky top-0 z-10 mb-1 bg-muted/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                    {category}
                  </div>
                  <div className="space-y-0.5 px-1.5">
                    {examples.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => handleExampleSelect(ex)}
                        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-start transition-colors ${
                          activeExample === ex.id
                            ? "bg-primary/10"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <span className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                          activeExample === ex.id
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {ex.name.charAt(0)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className={`truncate text-xs font-medium leading-snug ${
                            activeExample === ex.id ? "text-primary" : "text-foreground"
                          }`}>{ex.name}</div>
                          <div className="truncate text-[10px] leading-snug text-muted-foreground">{ex.description}</div>
                        </div>
                        {activeExample === ex.id && (
                          <svg className="size-3.5 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
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
          <ResizablePanel id="preview" defaultSize="32" minSize="20" maxSize="60" className="flex flex-col min-w-0">
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
          <ResizablePanel id="inspector" defaultSize="20" minSize="12" maxSize="35" className="flex flex-col min-w-0">
            <div className="flex shrink-0 h-8 items-center border-b border-border bg-muted/50 px-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inspector</span>
            </div>
            <DesktopInspector
              actionLog={actionLog}
              clearActionLog={clearActionLog}
              currentDataModel={currentDataModel}
              layoutState={layoutState.inspector}
              onLayoutChanged={handleInspectorLayoutChange}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
