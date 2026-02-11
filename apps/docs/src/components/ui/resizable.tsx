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
        "relative shrink-0 items-center justify-center bg-border transition-colors hover:bg-border/80",
        isVertical
          ? "flex h-px w-full min-h-1 cursor-row-resize flex-col"
          : "flex w-px cursor-col-resize",
        withHandle
          ? (isVertical
            ? "after:absolute after:inset-x-0 after:top-1/2 after:h-1 after:-translate-y-1/2 after:rounded-sm after:bg-border after:transition-colors hover:after:bg-primary/30"
            : "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 after:rounded-sm after:bg-border after:transition-colors hover:after:bg-primary/30")
          : undefined,
        className
      )}
      {...props}
    />
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
