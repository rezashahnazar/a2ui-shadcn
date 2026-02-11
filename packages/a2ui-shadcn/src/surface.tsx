"use client";

/**
 * A2UISurface - main component that consumes A2UI messages and renders the UI
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  A2UIMessage,
  ActionMessage,
  A2UIComponent,
  A2UITheme,
  TransportConfig,
  ComponentRegistry,
} from "./types";
import { createDataModelStore } from "./store";
import { createTransport } from "./transport";
import {
  buildComponentMap,
  getRootId,
  renderComponent,
  type RendererContext,
} from "./renderer";
import { defaultRegistry } from "./adapters";
import { SurfaceDataModelProvider } from "./context";

export interface SurfaceState {
  components: Map<string, A2UIComponent>;
  rootId: string | null;
  dataModel: ReturnType<typeof createDataModelStore>;
  dir: "ltr" | "rtl";
  theme?: A2UITheme;
  dataVersion: number;
  /** When true, include full data model in every action sent to server (A2UI sendDataModel) */
  sendDataModel?: boolean;
}

export interface A2UISurfaceProps {
  surfaceId: string;
  transport?: TransportConfig;
  messages?: A2UIMessage[];
  onAction?: (action: ActionMessage["action"]) => void;
  theme?: A2UITheme;
  componentRegistry?: ComponentRegistry;
  dir?: "ltr" | "rtl";
  className?: string;
}

export function A2UISurface({
  surfaceId,
  transport: transportConfig,
  messages = [],
  onAction,
  theme,
  componentRegistry = {},
  dir = "ltr",
  className = "",
}: A2UISurfaceProps) {
  const [state, setState] = useState<SurfaceState>({
    components: new Map(),
    rootId: null,
    dataModel: createDataModelStore({}),
    dir,
    theme,
    dataVersion: 0,
  });

  const transportRef = useRef<ReturnType<typeof createTransport> | null>(null);
  const messagesProcessedRef = useRef(0);
  const prevMessagesRef = useRef<A2UIMessage[]>(messages);

  useEffect(() => {
    const dm = state.dataModel as { onChange?: (cb: () => void) => () => void };
    if (dm.onChange) {
      return dm.onChange(() => setState((s) => ({ ...s, dataVersion: s.dataVersion + 1 })));
    }
  }, [state.dataModel]);

  const handleMessage = useCallback(
    (msg: A2UIMessage) => {
      if ("createSurface" in msg && msg.createSurface) {
        const cs = msg.createSurface;
        if (cs.surfaceId !== surfaceId) return;
        setState((prev) => ({
          ...prev,
          dir: (cs.config?.dir as "ltr" | "rtl") ?? prev.dir,
          theme: cs.theme ?? prev.theme,
          sendDataModel: cs.sendDataModel ?? prev.sendDataModel,
        }));
      }
      if ("updateComponents" in msg && msg.updateComponents) {
        const uc = msg.updateComponents;
        if (uc.surfaceId !== surfaceId) return;
        const map = buildComponentMap(uc.components);
        const rootId = getRootId(uc.components);
        setState((prev) => ({
          ...prev,
          components: map,
          rootId,
        }));
      }
      if ("updateDataModel" in msg && msg.updateDataModel) {
        const ud = msg.updateDataModel;
        if (ud.surfaceId !== surfaceId) return;
        setState((prev) => {
          const dm = prev.dataModel;
          const path = ud.path ?? "/";
          if (ud.value === undefined) {
            return prev;
          }
          dm.set(path, ud.value);
          return { ...prev, dataVersion: prev.dataVersion + 1 };
        });
      }
      if ("deleteSurface" in msg && msg.deleteSurface) {
        if (msg.deleteSurface.surfaceId === surfaceId) {
          setState((prev) => ({
            ...prev,
            components: new Map(),
            rootId: null,
          }));
        }
      }
    },
    [surfaceId]
  );

  useEffect(() => {
    if (prevMessagesRef.current !== messages) {
      messagesProcessedRef.current = 0;
      prevMessagesRef.current = messages;
    }
    for (let i = messagesProcessedRef.current; i < messages.length; i++) {
      handleMessage(messages[i]);
    }
    messagesProcessedRef.current = messages.length;
  }, [messages, handleMessage]);

  useEffect(() => {
    if (transportConfig && transportConfig.type !== "manual") {
      const transport = createTransport(transportConfig);
      transportRef.current = transport;
      transport.connect(handleMessage);
      return () => {
        transport.disconnect();
        transportRef.current = null;
      };
    }
  }, [transportConfig, handleMessage]);

  const handleAction = useCallback(
    (action: Omit<ActionMessage["action"], "version">) => {
      const store = state.dataModel as { getAll?: () => Record<string, unknown> };
      const fullAction: ActionMessage["action"] = {
        ...action,
        surfaceId,
        sourceComponentId: action.sourceComponentId,
        name: action.name,
        context: action.context,
        timestamp: action.timestamp,
        ...(state.sendDataModel && store.getAll
          ? { dataModel: store.getAll() }
          : {}),
      };
      onAction?.(fullAction);
      transportRef.current?.sendAction?.(fullAction);
    },
    [surfaceId, onAction, state.sendDataModel, state.dataModel]
  );

  const registry = useMemo(
    () => ({ ...defaultRegistry, ...componentRegistry }),
    [componentRegistry]
  );

  const renderContext: RendererContext = useMemo(
    () => ({
      components: state.components,
      rootId: state.rootId ?? "",
      dataModel: state.dataModel,
      surfaceId,
      onAction: handleAction,
      dir: state.dir,
      theme: state.theme ?? theme,
      registry,
    }),
    [
      state.components,
      state.rootId,
      state.dataModel,
      state.dir,
      state.theme,
      surfaceId,
      handleAction,
      theme,
      registry,
    ]
  );

  const content =
    state.rootId && state.components.size > 0
      ? renderComponent(renderContext, state.rootId)
      : null;

  return (
    <SurfaceDataModelProvider
      value={{ surfaceId, dataModel: state.dataModel as import("./store").DataModelStoreWithChange }}
    >
      <div
        className={className}
        dir={state.dir}
        data-surface-id={surfaceId}
      >
        {content}
      </div>
    </SurfaceDataModelProvider>
  );
}
