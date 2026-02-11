"use client";

import type { ReactNode } from "react";

interface InfoBoxProps {
  type?: "info" | "warning" | "tip" | "danger";
  title?: string;
  children: ReactNode;
}

export function InfoBox({ type = "info", title, children }: InfoBoxProps) {
  const styles = {
    info: {
      container: "border-blue-500/30 bg-blue-500/5",
      icon: "text-blue-500",
      title: "text-blue-700 dark:text-blue-400",
      iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    warning: {
      container: "border-yellow-500/30 bg-yellow-500/5",
      icon: "text-yellow-500",
      title: "text-yellow-700 dark:text-yellow-400",
      iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
    tip: {
      container: "border-green-500/30 bg-green-500/5",
      icon: "text-green-500",
      title: "text-green-700 dark:text-green-400",
      iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
    danger: {
      container: "border-red-500/30 bg-red-500/5",
      icon: "text-red-500",
      title: "text-red-700 dark:text-red-400",
      iconPath: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  };

  const style = styles[type];

  return (
    <div className={`my-6 rounded-lg border p-4 ${style.container}`}>
      <div className="flex gap-3">
        <div className="shrink-0">
          <svg className={`size-5 ${style.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.iconPath} />
          </svg>
        </div>
        <div className="flex-1 -mt-0.5">
          {title && (
            <h5 className={`mb-1 text-sm font-semibold ${style.title}`}>{title}</h5>
          )}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
