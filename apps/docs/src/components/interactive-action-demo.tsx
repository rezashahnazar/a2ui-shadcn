"use client";

import { useState, useCallback } from "react";
import { A2UISurface } from "a2ui-shadcn";
import type { A2UIMessage } from "a2ui-shadcn";

const twoWayBindingExample: A2UIMessage[] = [
  {
    version: "v0.9",
    createSurface: { surfaceId: "demo_two_way", catalogId: "standard" },
  },
  {
    version: "v0.9",
    updateComponents: {
      surfaceId: "demo_two_way",
      components: [
        { id: "root", component: "Column", children: ["input", "display"] },
        {
          id: "input",
          component: "TextField",
          label: "Type here",
          value: { path: "/input" },
          placeholder: "Start typing...",
        },
        {
          id: "display",
          component: "Text",
          text: { path: "/input" },
          variant: "body",
          tone: "muted",
        },
      ],
    },
  },
  {
    version: "v0.9",
    updateDataModel: { surfaceId: "demo_two_way", path: "/input", value: "" },
  },
];

const actionExample: A2UIMessage[] = [
  {
    version: "v0.9",
    createSurface: { surfaceId: "demo_action", catalogId: "standard" },
  },
  {
    version: "v0.9",
    updateComponents: {
      surfaceId: "demo_action",
      components: [
        { id: "root", component: "Column", children: ["name", "email", "submit"] },
        {
          id: "name",
          component: "TextField",
          label: "Name",
          value: { path: "/form/name" },
          placeholder: "Your name",
        },
        {
          id: "email",
          component: "TextField",
          label: "Email",
          value: { path: "/form/email" },
          placeholder: "you@example.com",
        },
        {
          id: "submit",
          component: "Button",
          text: "Submit",
          action: {
            event: {
              name: "form_submit",
              context: {
                name: { path: "/form/name" },
                email: { path: "/form/email" },
              },
            },
          },
        },
      ],
    },
  },
  {
    version: "v0.9",
    updateDataModel: { surfaceId: "demo_action", path: "/form", value: { name: "", email: "" } },
  },
];

interface DemoProps {
  title: string;
  description: string;
  messages: A2UIMessage[];
  surfaceId: string;
}

function Demo({ title, description, messages, surfaceId }: DemoProps) {
  const [lastAction, setLastAction] = useState<{ name: string; context: Record<string, unknown> } | null>(null);

  const handleAction = useCallback((action: { name: string; context?: Record<string, unknown> }) => {
    setLastAction({ name: action.name, context: action.context || {} });
  }, []);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="rounded border border-border bg-background p-4">
        <A2UISurface surfaceId={surfaceId} messages={messages} onAction={handleAction} />
      </div>
      {lastAction && (
        <div className="mt-3 rounded border border-primary/20 bg-primary/5 p-3 text-xs animate-in fade-in">
          <div className="font-semibold">Action Triggered:</div>
          <div className="mt-1">
            <code className="text-xs">{lastAction.name}</code>
          </div>
          {Object.keys(lastAction.context).length > 0 && (
            <div className="mt-2">
              <div className="text-muted-foreground">Context:</div>
              <pre className="mt-1 overflow-x-auto rounded bg-background p-2 text-[10px] leading-tight">
                {JSON.stringify(lastAction.context, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function InteractiveActionDemo() {
  return (
    <div className="my-8 space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="font-semibold text-sm">Try It Yourself</div>
        <p className="mt-1 text-xs text-muted-foreground">
          These are live, interactive examples. Type in the inputs and click buttons to see how a2ui-shadcn handles reactivity and actions.
        </p>
      </div>

      <Demo
        title="Two-Way Data Binding"
        description="As you type, the data model updates immediately and the Text component below re-renders with the new value (no server round-trip)."
        messages={twoWayBindingExample}
        surfaceId="demo_two_way"
      />

      <Demo
        title="Action with Context Resolution"
        description="Fill the form and click Submit. The button's context (with path bindings) is resolved to current values and sent via onAction."
        messages={actionExample}
        surfaceId="demo_action"
      />
    </div>
  );
}
