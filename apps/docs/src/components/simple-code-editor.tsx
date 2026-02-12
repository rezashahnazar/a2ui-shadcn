"use client";

import { useCallback, useRef } from "react";
import SimpleEditor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-json";

interface SimpleCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

export function SimpleCodeEditor({
  value,
  onChange,
  readOnly = false,
  className = "",
}: SimpleCodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const highlight = useCallback((code: string) => {
    try {
      return Prism.highlight(code, Prism.languages.json, "json");
    } catch {
      return code;
    }
  }, []);

  return (
    <div
      ref={editorRef}
      className={`relative overflow-auto rounded-lg border border-border bg-background ${className}`.trim()}
    >
      <SimpleEditor
        value={value}
        onValueChange={readOnly ? () => {} : onChange}
        highlight={highlight}
        padding={12}
        textareaId="mobile-json-editor"
        textareaClassName="mobile-code-textarea"
        className="mobile-code-editor"
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          fontSize: 13,
          lineHeight: 1.6,
          minHeight: "100%",
        }}
      />
    </div>
  );
}
