"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeAwareLogo } from "@/components/theme-aware-logo";

export function PlaygroundHeader() {
  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-border bg-muted/20 backdrop-blur-sm supports-[backdrop-filter]:bg-muted/20" role="banner">
      <nav className="mx-auto flex h-14 min-h-14 max-w-full items-center justify-between gap-4 px-4 sm:px-6" role="navigation" aria-label="Main navigation">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <ThemeAwareLogo
            width={28}
            height={28}
            className="size-7"
            priority
          />
          <span className="truncate text-base font-semibold tracking-tight sm:max-w-40">a2ui-shadcn</span>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <Link
            href="/docs/introduction"
            className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Docs
          </Link>
          <Link
            href="/examples"
            className="rounded-md px-2.5 py-1.5 text-sm font-medium text-primary transition-colors"
          >
            Playground
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
