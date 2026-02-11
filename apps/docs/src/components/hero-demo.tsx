"use client";

import { A2UISurface, type A2UIMessage } from "a2ui-shadcn";
import { CodeBlock } from "@/components/code-block";
import { useState } from "react";

const DEMO_JSON = `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "hero",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "hero",
      "components": [
        {
          "id": "root",
          "component": "Card",
          "children": ["header", "content", "footer"]
        },
        {
          "id": "header",
          "component": "Column",
          "children": ["title", "desc"],
          "className": "p-6 pb-3 gap-2"
        },
        {
          "id": "title",
          "component": "Text",
          "text": "Agent Output",
          "variant": "h3"
        },
        {
          "id": "desc",
          "component": "Text",
          "text": "This UI is rendered from the JSON on the left.",
          "tone": "muted"
        },
        {
          "id": "content",
          "component": "Column",
          "children": ["info"],
          "align": "start",
          "className": "px-6 py-4"
        },
        {
          "id": "info",
          "component": "Badge",
          "text": "Live Render",
          "variant": "success",
          "size": "md"
        },
        {
          "id": "footer",
          "component": "Row",
          "children": ["cancel", "submit"],
          "className": "px-6 pb-6 pt-3 gap-3",
          "justify": "end"
        },
        {
          "id": "cancel",
          "component": "Button",
          "text": "Cancel",
          "variant": "ghost"
        },
        {
          "id": "submit",
          "component": "Button",
          "text": "Confirm",
          "variant": "primary"
        }
      ]
    }
  }
]`;

function parseDemoMessages(): A2UIMessage[] {
  try {
    return JSON.parse(DEMO_JSON);
  } catch {
    return [];
  }
}

export function HeroDemo() {
  const [messages] = useState<A2UIMessage[]>(parseDemoMessages);

  return (
    <div className="mx-auto mt-12 max-w-5xl px-2 sm:mt-16 sm:px-0">
      <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-12">
        {/* Left: JSON Input */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              1. Agent Sends JSON
            </h3>
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/20" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30 transition-colors hover:border-border/80">
            <CodeBlock 
              code={DEMO_JSON} 
              language="json" 
              showLineNumbers 
              collapsible
              maxHeight={260}
            />
          </div>
        </div>

        {/* Right: UI Output */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              2. User Sees UI
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live
            </div>
          </div>
          <div className="relative flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-border bg-background p-4 sm:min-h-[280px] sm:p-8 transition-colors hover:border-border/80">
            <div className="w-full max-w-sm">
              <A2UISurface
                surfaceId="hero"
                messages={messages}
                className="w-full"
              />
            </div>
            
            {/* Decoration */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
