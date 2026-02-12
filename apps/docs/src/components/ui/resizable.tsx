"use client";

import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof Group>) {
  return (
    <Group
      className={cn(
        "flex h-full w-full data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}

function ResizablePanel({ className, ...props }: React.ComponentProps<typeof Panel>) {
  return (
    <Panel
      className={cn(
        "relative flex w-full grow overflow-hidden data-[orientation=vertical]:h-full",
        className
      )}
      {...props}
    />
  );
}

function ResizableHandle({
  className,
  withHandle = false,
  orientation,
  ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean; orientation?: "horizontal" | "vertical" }) {
  const isVertical = orientation === "vertical";
  return (
    <Separator
      className={cn(
        "relative shrink-0 items-center justify-center transition-colors",
        isVertical
          ? "flex w-full cursor-row-resize flex-col"
          : "flex cursor-col-resize",
        // Thin visible line with generous touch target via ::before
        isVertical
          ? "h-px bg-border/60 before:absolute before:inset-x-0 before:top-1/2 before:h-5 before:-translate-y-1/2 before:content-['']"
          : "w-px bg-border/60 before:absolute before:inset-y-0 before:left-1/2 before:w-5 before:-translate-x-1/2 before:content-['']",
        withHandle
          ? (isVertical
            ? "after:absolute after:left-1/2 after:top-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-colors hover:after:bg-primary/40"
            : "after:absolute after:left-1/2 after:top-1/2 after:h-8 after:w-0.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-colors hover:after:bg-primary/40")
          : undefined,
        className
      )}
      {...props}
    />
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
