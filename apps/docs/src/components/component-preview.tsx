"use client";

import { useMemo } from "react";
import { A2UISurface } from "a2ui-shadcn";
import type { A2UIMessage } from "a2ui-shadcn";
import { CodeBlock } from "./code-block";
import { motion } from "framer-motion";

interface ComponentPreviewProps {
  title: string;
  description: string;
  json: string;
}

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

export function ComponentPreview({ title, description, json }: ComponentPreviewProps) {
  const { messages, error } = useMemo(() => parseMessages(json), [json]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Preview Panel */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="border-b border-border bg-muted/30 px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">Preview</span>
        </div>
        <div className="bg-card/30 p-6">
          {error ? (
            <div className="flex items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
              <div>
                <svg className="mx-auto mb-3 size-8 text-destructive/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-destructive">Error rendering preview</p>
                <p className="mt-1 text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : (
            <A2UISurface
              surfaceId="demo"
              messages={messages}
              onAction={(action) => {
                console.log("Action:", action);
                alert(`Action triggered: ${action.name}\n\nContext:\n${JSON.stringify(action.context, null, 2)}`);
              }}
            />
          )}
        </div>
      </div>

      {/* Code Block - collapsible with max height */}
      <div className="mt-4">
        <CodeBlock code={json} language="json" collapsible maxHeight={180} />
      </div>
    </motion.div>
  );
}
