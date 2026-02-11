"use client";

import { motion } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

/** Deterministic positions from index so server and client match (avoids hydration mismatch). */
function generateSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: ((i * 7 + 13) % 97) + 1.5,
    y: ((i * 11 + 31) % 97) + 1.5,
    delay: (i * 0.17) % 2,
  }));
}

export function Sparkles({ count = 8 }: { count?: number }) {
  const sparkles = generateSparkles(count);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute size-1 rounded-full bg-primary/40"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
