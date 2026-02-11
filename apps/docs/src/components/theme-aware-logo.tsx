"use client";

import * as React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import logo from "@/images/logo.png";
import logoBlack from "@/images/logo-black.png";

interface ThemeAwareLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function ThemeAwareLogo({
  width = 32,
  height = 32,
  className,
  priority = false,
}: ThemeAwareLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const src = mounted && resolvedTheme === "light" ? logoBlack : logo;

  return (
    <Image
      src={src}
      alt="a2ui-shadcn logo"
      width={width}
      height={height}
      className={className ? `rounded-md ${className}` : "rounded-md"}
      priority={priority}
    />
  );
}
