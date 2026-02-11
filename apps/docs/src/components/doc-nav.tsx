"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { getComponentsByCategory } from "@/lib/component-docs";

const navItems = [
  {
    section: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Usage", href: "/docs/usage" },
    ],
  },
  {
    section: "Components",
    items: [
      { title: "Components", href: "/docs/components", expandable: true },
    ],
  },
  {
    section: "Reactivity & Actions",
    items: [
      { title: "Actions", href: "/docs/actions" },
      { title: "Transport", href: "/docs/transport" },
    ],
  },
  {
    section: "Styling",
    items: [
      { title: "Theming", href: "/docs/theming" },
      { title: "RTL Support", href: "/docs/rtl" },
    ],
  },
  {
    section: "Advanced",
    items: [
      { title: "Custom Components", href: "/docs/custom" },
      { title: "API Reference", href: "/docs/api" },
    ],
  },
];

export function DocNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [expandedComponents, setExpandedComponents] = useState(true);
  const componentsByCategory = getComponentsByCategory();

  return (
    <nav className="space-y-6">
      {navItems.map((section) => (
        <div key={section.section}>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.section}
          </h4>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const isComponentsPage = item.href === "/docs/components";
              
              return (
                <li key={item.href}>
                  <div>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                      onClick={() => {
                        onNavigate?.();
                        if (isComponentsPage) {
                          setExpandedComponents(!expandedComponents);
                        }
                      }}
                    >
                      <span>{item.title}</span>
                      {"expandable" in item && item.expandable && (
                        <svg
                          className={`size-4 transition-transform ${expandedComponents ? "rotate-90" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-y-0 start-0 w-1 rounded-e bg-primary"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>

                    {/* Expandable component list */}
                    {"expandable" in item && item.expandable && expandedComponents && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-1 space-y-0.5 ps-4"
                      >
                        {Object.entries(componentsByCategory).map(([category, components]) => (
                          components.length > 0 && (
                            <div key={category} className="space-y-0.5">
                              <div className="px-3 py-1 text-xs font-medium text-muted-foreground/70">
                                {category}
                              </div>
                              {components.map((comp) => {
                                const compPath = `/docs/components/${comp.slug}`;
                                const isCompActive = pathname === compPath;
                                return (
                                  <Link
                                    key={comp.slug}
                                    href={compPath}
                                    onClick={onNavigate}
                                    className={`block rounded-md px-3 py-1.5 text-xs transition-all ${
                                      isCompActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                  >
                                    {comp.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )
                        ))}
                      </motion.div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
