"use client";

import { motion } from "framer-motion";

const flows = [
  {
    id: "two-way",
    title: "Two-Way Binding (Inputs)",
    steps: [
      { label: "User types/checks", desc: "TextField, CheckBox, Slider" },
      { label: "dataModel.set(path, value)", desc: "Immediate local update (no server)" },
      { label: "Store notifies subscribers", desc: "Zustand subscription" },
      { label: "Bound components re-render", desc: "Text, display components update" },
    ],
  },
  {
    id: "actions",
    title: "User Actions (Buttons, Links)",
    steps: [
      { label: "User clicks", desc: "Button/Link with action.event" },
      { label: "Resolve context recursively", desc: "{ path } -> values, { call } -> exec" },
      { label: "Build action payload", desc: "name, context, sourceComponentId" },
      { label: "Add dataModel (if sendDataModel)", desc: "Full state snapshot included" },
      { label: "onAction + transport", desc: "To parent callback / WebSocket / SSE" },
    ],
  },
];

export function ActionReactiveDiagram() {
  return (
    <div className="my-8 space-y-8 rounded-lg border border-border bg-linear-to-br from-muted/20 to-muted/5 p-6">
      <div className="text-center">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          How a2ui-shadcn Handles Reactivity & Actions
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Two reactive flows: instant local updates (inputs) and agent-bound actions (buttons)
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        {flows.map((flow, flowIdx) => (
          <motion.div
            key={flow.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: flowIdx * 0.1 }}
            className="rounded-lg border border-border bg-card/80 p-4 shadow-sm"
          >
            <div className="mb-4">
              <h4 className="text-sm font-semibold">{flow.title}</h4>
            </div>
            <div className="space-y-3">
              {flow.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="relative flex shrink-0 flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary ring-2 ring-background">
                      {i + 1}
                    </div>
                    {i < flow.steps.length - 1 && (
                      <div className="mt-1 h-full w-0.5 flex-1 bg-border" style={{ minHeight: "12px" }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-2">
                    <div className="text-sm font-medium leading-tight">{step.label}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="space-y-2 rounded border border-primary/20 bg-primary/5 px-4 py-3 text-xs">
        <div className="font-semibold text-foreground">Key Concepts:</div>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            <strong>Path bindings:</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono">{"{ path: \"/key\" }"}</code> - resolved to current data model value
          </li>
          <li>
            <strong>FunctionCall:</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono">{"{ call: \"formatDate\", args: {...} }"}</code> - executed and result included in context
          </li>
          <li>
            <strong>sendDataModel:</strong> When enabled in createSurface, full data model sent with every action
          </li>
        </ul>
      </div>
    </div>
  );
}
