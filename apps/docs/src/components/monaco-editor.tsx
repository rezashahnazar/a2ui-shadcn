"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useIsDesktop } from "@/lib/use-media-query";
import { SimpleCodeEditor } from "@/components/simple-code-editor";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  className?: string;
}

export function MonacoEditor({
  value,
  onChange,
  language = "json",
  height = "400px",
  readOnly = false,
  className = "",
}: MonacoEditorProps) {
  const { resolvedTheme } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const isDesktop = useIsDesktop();

  // Mobile: use lightweight simple code editor (touch & keyboard friendly)
  if (!isDesktop) {
    return (
      <SimpleCodeEditor
        value={value}
        onChange={(v) => onChange(v)}
        readOnly={readOnly}
        className={className}
      />
    );
  }

  // Desktop: use full Monaco Editor
  return (
    <div className={`relative overflow-hidden rounded-lg border border-border ${className}`.trim()}>
      {!isReady && (
        <div className="shimmer shimmer-bg absolute inset-0 flex items-center justify-center bg-muted/30">
          <div className="text-sm text-muted-foreground">Loading editor...</div>
        </div>
      )}
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineHeight: 20,
          lineNumbers: "on",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          readOnly,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          formatOnPaste: true,
          formatOnType: true,
          folding: true,
          bracketPairColorization: {
            enabled: true,
          },
          padding: {
            top: 10,
            bottom: 10,
          },
        }}
        onMount={() => setIsReady(true)}
      />
    </div>
  );
}
