/**
 * Adjacency list renderer - builds component tree from flat component list
 */

import React from "react";
import type { A2UIComponent, ComponentAdapterProps, DataModelStore } from "./types";
import type { ComponentRegistry } from "./types";
import { resolveValue, isPathBinding } from "./utils";
import { defaultRegistry } from "./adapters";

export interface RendererContext {
  components: Map<string, A2UIComponent>;
  rootId: string;
  dataModel: DataModelStore;
  surfaceId: string;
  onAction: (action: Omit<import("./types").ActionMessage["action"], "version">) => void;
  dir: "ltr" | "rtl";
  theme?: import("./types").A2UITheme;
  registry: ComponentRegistry;
}

function createResolve(
  component: A2UIComponent,
  dataModel: DataModelStore
): ComponentAdapterProps["resolveValue"] {
  return <T,>(binding: unknown, fallback: T): T => {
    if (binding === undefined || binding === null) return fallback;
    if (isPathBinding(binding)) {
      const value = dataModel.get(binding.path);
      return (value !== undefined ? value : fallback) as T;
    }
    return binding as T;
  };
}

export function renderComponent(
  ctx: RendererContext,
  componentId: string
): React.ReactNode {
  const comp = ctx.components.get(componentId);
  if (!comp) return null;

  const Adapter = ctx.registry[comp.component];
  if (!Adapter) return null;

  const childrenIds = (comp.children ?? (comp.child ? [comp.child] : [])) as string[];
  const children = childrenIds.map((id) => renderComponent(ctx, id)).filter(Boolean);

  const adapterProps: ComponentAdapterProps = {
    component: comp,
    children: children.length > 0 ? <>{children}</> : undefined,
    dataModel: ctx.dataModel,
    surfaceId: ctx.surfaceId,
    onAction: ctx.onAction,
    dir: ctx.dir,
    theme: ctx.theme,
    resolveValue: createResolve(comp, ctx.dataModel),
  };

  return <Adapter key={comp.id} {...adapterProps} />;
}

export function buildComponentMap(
  components: A2UIComponent[]
): Map<string, A2UIComponent> {
  const map = new Map<string, A2UIComponent>();
  for (const c of components) {
    map.set(c.id, c);
  }
  return map;
}

export function getRootId(components: A2UIComponent[]): string | null {
  const found = components.find((c) => c.id === "root");
  return found ? "root" : null;
}
