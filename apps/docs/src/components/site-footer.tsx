"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function SiteFooter() {
  const pathname = usePathname();
  const isPlayground = pathname === "/playground";

  // Don't render footer on playground - it uses full viewport height
  if (isPlayground) return null;

  return <Footer />;
}
