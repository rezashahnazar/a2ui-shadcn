"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Play } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeAwareLogo } from "@/components/theme-aware-logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/docs/introduction", label: "Docs", icon: BookOpen },
  { href: "/playground", label: "Playground", icon: Play },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPlayground = pathname === "/playground";

  if (isPlayground) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md" role="banner">
      <nav className="mx-auto flex h-14 min-h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6" role="navigation" aria-label="Main navigation">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <ThemeAwareLogo
            width={28}
            height={28}
            className="size-7"
            priority
          />
          <span className="text-base font-semibold tracking-tight">a2ui-shadcn</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 sm:flex sm:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Open menu"
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,85vw)] gap-1.5">
              <SheetHeader className="border-b border-border/60 p-4 pb-2">
                <SheetTitle className="text-lg">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-0.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href === "/docs/introduction" && pathname.startsWith("/docs")) || (link.href === "/playground" && pathname.startsWith("/playground"));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
                        isActive ? "bg-primary/15 text-primary" : "bg-muted/60 text-muted-foreground group-hover:bg-accent"
                      }`}>
                        <Icon className="size-4" strokeWidth={2} />
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
