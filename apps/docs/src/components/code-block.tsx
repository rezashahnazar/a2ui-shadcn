"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

/** Prevents hydration mismatch by checking if component is mounted */
function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  maxHeight?: number;
}

export function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = false,
  collapsible = false,
  maxHeight = 200,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(2000);
  const [needsCollapse, setNeedsCollapse] = useState(collapsible);
  const contentRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!collapsible || !contentRef.current || !mounted) return;
    const el = contentRef.current;
    const shouldCollapse = el.scrollHeight > maxHeight;
    setNeedsCollapse(shouldCollapse);
    if (!shouldCollapse) setExpanded(true);
  }, [collapsible, maxHeight, code, mounted]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syntaxBg = isDark ? "rgb(10 10 10 / 0.8)" : "rgb(244 244 244 / 0.8)";
  const fadeFrom = isDark ? "rgb(10 10 10)" : "rgb(244 244 244)";

  // Show placeholder during SSR to avoid hydration mismatch
  const syntaxContent = !mounted ? (
    <div
      className="shimmer shimmer-bg overflow-hidden rounded-lg font-mono text-[0.75rem] leading-snug bg-muted/40"
      style={{
        margin: 0,
        padding: "0.75rem",
        minHeight: "80px",
      }}
    />
  ) : (
    <SyntaxHighlighter
      language={language}
      style={isDark ? vscDarkPlus : vs}
      showLineNumbers={showLineNumbers}
      customStyle={{
        margin: 0,
        padding: "0.75rem 0.75rem",
        fontSize: "0.75rem",
        lineHeight: "1.4",
        background: syntaxBg,
        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
      }}
      wrapLongLines={true}
      codeTagProps={{
        style: {
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        },
      }}
    >
      {code}
    </SyntaxHighlighter>
  );

  const content = (
    <div
      ref={contentRef}
      className={collapsible ? "overflow-hidden" : "overflow-hidden rounded-lg border border-border"}
    >
      {syntaxContent}
    </div>
  );

  if (collapsible) {
    const isCollapsed = needsCollapse && !expanded;
    return (
      <div className="group relative">
        <motion.div
          className="relative overflow-hidden rounded-lg border border-border"
          initial={false}
          animate={{
            height: isCollapsed ? maxHeight : expandedHeight,
          }}
          transition={{
            duration: 0.45,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          {/* When collapsed, fixed height so gradient is at bottom of visible frame */}
          <div
            className="relative h-full overflow-hidden"
            style={isCollapsed ? { height: maxHeight } : undefined}
          >
            {content}
            <AnimatePresence mode="wait">
              {isCollapsed && mounted && (
                <motion.div
                  key="fade"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden"
                  style={{
                    height: 96,
                    background: `linear-gradient(to top, ${fadeFrom} 0%, ${fadeFrom} 40%, transparent 100%)`,
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <div className="absolute end-2 top-2 flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <div className="rounded bg-muted/90 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            {language}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="cursor-pointer rounded bg-muted/90 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? (
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        {needsCollapse && (
          <div className="my-1 flex justify-center">
            <motion.button
              type="button"
              onClick={() => {
                if (!expanded && contentRef.current) {
                  setExpandedHeight(contentRef.current.scrollHeight);
                }
                setExpanded((prev) => !prev);
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
              whileTap={{ scale: 0.98 }}
            >
              {expanded ? (
                <>
                  Show less
                  <svg className="size-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  Show more
                  <svg className="size-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative">
      {content}
      <div className="absolute end-2 top-2 flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        <div className="rounded bg-muted/90 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          {language}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer rounded bg-muted/90 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
