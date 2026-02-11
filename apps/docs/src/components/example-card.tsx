"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ExampleCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

export function ExampleCard({ title, description, icon, onClick, isActive }: ExampleCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative w-full rounded-lg border p-4 text-start transition-all ${
        isActive
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent"
      }`}
    >
      {icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          {icon}
        </div>
      )}
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {isActive && (
        <div className="absolute end-2 top-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </motion.button>
  );
}
