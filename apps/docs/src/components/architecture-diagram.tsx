"use client";

import { motion } from "framer-motion";

const nodes = [
  {
    id: "agent",
    label: "Agent",
    sublabel: "AI or Backend Service",
    detail: "Python, Node.js",
  },
  {
    id: "renderer",
    label: "a2ui-shadcn",
    sublabel: "React Renderer",
    detail: null,
  },
  {
    id: "ui",
    label: "shadcn/ui",
    sublabel: "Components",
    detail: null,
  },
];

const connections = [
  { label: "A2UI JSON Messages", sublabel: "WebSocket / SSE / HTTP" },
  { label: "React Components", sublabel: null },
];

export function ArchitectureDiagram() {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-border bg-muted/20 p-6">
      <div className="mx-auto max-w-[220px]">
        <div className="flex flex-col items-center">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex w-full flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex w-full flex-col items-center rounded-lg border border-border bg-card px-5 py-3.5 text-center transition-colors hover:border-primary/40"
              >
                <span className="text-sm font-semibold">{node.label}</span>
                <span className="mt-0.5 text-xs text-muted-foreground">{node.sublabel}</span>
                {node.detail && (
                  <span className="mt-1 text-[11px] text-muted-foreground/80">({node.detail})</span>
                )}
              </motion.div>

              {index < nodes.length - 1 && (
                <div className="flex flex-col items-center py-2">
                  <div className="h-3 w-px bg-border" />
                  <svg
                    className="my-0.5 size-4 shrink-0 text-muted-foreground/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div className="rounded border border-border bg-background/80 px-2.5 py-1 text-[11px] text-muted-foreground">
                    {connections[index]?.label}
                    {connections[index]?.sublabel && (
                      <span className="block text-muted-foreground/70">{connections[index].sublabel}</span>
                    )}
                  </div>
                  <div className="h-3 w-px bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
