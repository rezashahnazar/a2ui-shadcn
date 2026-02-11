"use client";

import { useState, useEffect } from "react";
import { DocNav } from "@/components/doc-nav";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DocsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:gap-12 lg:py-12">
      {/* Mobile: TOC toggle button */}
      <div className="flex shrink-0 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Open documentation navigation"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Documentation
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-14 hidden h-[calc(100vh-4rem)] w-52 shrink-0 lg:block">
        <ScrollArea className="h-full">
          <DocNav />
        </ScrollArea>
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!sidebarOpen}
      >
        <div
          className={`fixed inset-0 bg-foreground/20 transition-opacity duration-200 ease-out ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed inset-y-0 start-0 w-full max-w-[min(20rem,85vw)] border-e border-border bg-background transition-transform duration-200 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="text-sm font-semibold">Documentation</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Close navigation"
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="p-4">
              <DocNav onNavigate={() => setSidebarOpen(false)} />
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
