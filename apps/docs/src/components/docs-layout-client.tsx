"use client";

import { useState } from "react";
import { DocNav } from "@/components/doc-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function DocsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:gap-12 lg:py-12">
      {/* Mobile: TOC toggle button */}
      <div className="flex shrink-0 lg:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Open documentation navigation"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Documentation
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(20rem,85vw)] p-0">
            <SheetHeader className="border-b border-border/60 px-5 py-4">
              <SheetTitle className="text-lg">Documentation</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="p-5">
                <DocNav onNavigate={() => setSidebarOpen(false)} />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-14 hidden h-[calc(100vh-4rem)] w-52 shrink-0 lg:block">
        <ScrollArea className="h-full">
          <DocNav />
        </ScrollArea>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
