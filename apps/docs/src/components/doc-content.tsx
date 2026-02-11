"use client";

import Link from "next/link";
import { CodeBlock } from "./code-block";
import { InfoBox } from "./info-box";
import { ArchitectureDiagram } from "./architecture-diagram";
import { ActionReactiveDiagram } from "./action-reactive-diagram";
import { InteractiveActionDemo } from "./interactive-action-demo";

/**
 * Renders doc content with markdown-like structure (headings, code blocks, lists)
 */
export function DocContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mt-10 border-b border-border pb-2 text-xl font-semibold">
          {parseInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="mt-6 text-lg font-semibold">
          {parseInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      if (lang === "diagram:architecture") {
        elements.push(
          <div key={key++} className="my-6">
            <ArchitectureDiagram />
          </div>
        );
      } else if (lang === "diagram:action-reactive") {
        elements.push(
          <div key={key++} className="my-6">
            <ActionReactiveDiagram />
          </div>
        );
      } else if (lang === "demo:interactive-action") {
        elements.push(
          <div key={key++} className="my-6">
            <InteractiveActionDemo />
          </div>
        );
      } else {
        const code = codeLines.join("\n");
        const collapsible = codeLines.length > 14;
        elements.push(
          <div key={key++} className="my-6">
            <CodeBlock
              code={code}
              language={lang || "text"}
              collapsible={collapsible}
              maxHeight={200}
            />
          </div>
        );
      }
      continue;
    }
    if (line.startsWith("> ")) {
      // Blockquote / callout
      const quoteLines: string[] = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <InfoBox key={key++} type="tip">
          {quoteLines.map((l, j) => (
            <p key={j}>{parseInline(l)}</p>
          ))}
        </InfoBox>
      );
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="mt-4 list-disc space-y-1 ps-6">
          {items.map((item, j) => (
            <li key={j} className="leading-7">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    elements.push(
      <p key={key++} className="mt-4 leading-7 text-foreground/90">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return <div className="prose-docs space-y-2">{elements}</div>;
}

const INLINE_CODE_CLASS =
  "rounded-md border border-border bg-muted/80 px-1.5 py-0.5 font-mono text-[0.9em] font-medium text-foreground";

function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let partKey = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    let earliest: { index: number; type: "bold" | "code" | "link"; match: RegExpMatchArray } | null = null;
    if (boldMatch && boldMatch.index !== undefined) {
      earliest = { index: boldMatch.index, type: "bold", match: boldMatch };
    }
    if (codeMatch && codeMatch.index !== undefined) {
      if (!earliest || codeMatch.index < earliest.index) {
        earliest = { index: codeMatch.index, type: "code", match: codeMatch };
      }
    }
    if (linkMatch && linkMatch.index !== undefined) {
      if (!earliest || linkMatch.index < earliest.index) {
        earliest = { index: linkMatch.index, type: "link", match: linkMatch };
      }
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }
    if (earliest.type === "bold") {
      parts.push(<strong key={partKey++}>{parseInline(earliest.match[1])}</strong>);
    } else if (earliest.type === "code") {
      parts.push(
        <code key={partKey++} className={INLINE_CODE_CLASS}>
          {earliest.match[1]}
        </code>
      );
    } else {
      const href = earliest.match[2];
      const isInternal = href.startsWith("/") || href.startsWith("./");
      const resolvedHref = href.startsWith("./") ? `/docs${href.slice(1)}` : href;
      if (isInternal) {
        parts.push(
          <Link key={partKey++} href={resolvedHref} className="text-primary underline underline-offset-4 hover:text-primary/80">
            {parseInline(earliest.match[1])}
          </Link>
        );
      } else {
        parts.push(
          <a key={partKey++} href={href} className="text-primary underline underline-offset-4 hover:text-primary/80" target="_blank" rel="noopener noreferrer">
            {parseInline(earliest.match[1])}
          </a>
        );
      }
    }
    remaining = remaining.slice(earliest.index + earliest.match[0].length);
  }

  return <>{parts}</>;
}
