"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AnimatedCard({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="group rounded-xl border border-border/60 bg-card/50 p-6 transition-colors hover:border-border hover:bg-card/80"
    >
      {children}
    </motion.div>
  );
}
