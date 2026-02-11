import Link from "next/link";
import { GridPattern } from "@/components/grid-pattern";
import { AnimatedCard } from "@/components/animated-card";
import { CodeBlock } from "@/components/code-block";
import { Sparkles } from "@/components/sparkles";
import { ThemeAwareLogo } from "@/components/theme-aware-logo";
import { HeroDemo } from "@/components/hero-demo";
import { softwareSchema, faqSchema, howToSchema, courseSchema, organizationSchema } from "@/lib/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A2UI Protocol Renderer for shadcn/ui - Build Agent-Driven UIs",
  description: "a2ui-shadcn - Production-grade A2UI protocol renderer for shadcn/ui. Build dynamic, agent-driven UIs with React, TypeScript, and Tailwind CSS. Full RTL support, 30+ components, reactive data binding.",
  keywords: [
    "a2ui",
    "shadcn",
    "react",
    "agent ui",
    "protocol",
    "declarative ui",
    "json ui",
    "streaming ui",
    "rtl",
    "typescript",
    "tailwind",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "a2ui-shadcn - A2UI Protocol Renderer for shadcn/ui",
    description: "Build dynamic, agent-driven UIs with React and shadcn/ui. Full A2UI v0.9 support.",
    url: "https://a2ui-shadcn.shahnazar.me",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "a2ui-shadcn - A2UI Protocol Renderer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "a2ui-shadcn - A2UI Protocol Renderer for shadcn/ui",
    description: "Build dynamic, agent-driven UIs with React and shadcn/ui",
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="relative overflow-hidden">
        <GridPattern />
      
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        {/* Hero */}
        <section className="relative flex flex-col items-center text-center" aria-labelledby="hero-heading">
          <Sparkles count={12} />
          <div className="mb-8 flex justify-center">
            <ThemeAwareLogo
              width={100}
              height={100}
              className="rounded-xl size-20 sm:size-24 transition-transform hover:scale-105"
              priority
            />
          </div>
          
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            A2UI Protocol v0.9 Ready
          </div>

          <h1 id="hero-heading" className="max-w-4xl text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            <span className="shimmer shimmer-invert shimmer-speed-200 text-foreground/90">Stream UI from Agents</span>
            <br />
            <span className="shimmer shimmer-color-primary shimmer-speed-150 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">to React & shadcn</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            The <span className="shimmer shimmer-color-primary shimmer-speed-180 text-foreground font-semibold">production-grade renderer</span> that turns <strong className="text-foreground">JSON</strong> into fully interactive <strong className="text-foreground">shadcn/ui</strong> interfaces. 
            Type-safe, customizable, and built for the next generation of AI apps.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4">
            <Link
              href="/docs/installation"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/examples"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105"
            >
              Live Playground
            </Link>
          </div>

          {/* Hero Demo */}
          <HeroDemo />
        </section>

        {/* Features */}
        <section className="mt-16 sm:mt-24 lg:mt-32" aria-labelledby="features-heading">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for Agent UIs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built on the robust foundations of shadcn/ui and Tailwind CSS v4.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatedCard delay={0}>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Full Protocol Support</h3>
              <p className="mt-3 text-muted-foreground">
                Complete implementation of A2UI v0.9 including all 30+ components, from layouts to complex inputs.
              </p>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Reactive Data Store</h3>
              <p className="mt-3 text-muted-foreground">
                Built-in Zustand store handles two-way binding and JSON Pointer updates instantly without server round-trips.
              </p>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6 2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">RTL Native</h3>
              <p className="mt-3 text-muted-foreground">
                First-class support for Right-to-Left languages (Arabic, Hebrew, Persian) with logical properties and automatic layout mirroring.
              </p>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Type-Safe</h3>
              <p className="mt-3 text-muted-foreground">
                Written in TypeScript with comprehensive type definitions for schemas, events, and actions.
              </p>
            </AnimatedCard>

            <AnimatedCard delay={0.4}>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Fully Customizable</h3>
              <p className="mt-3 text-muted-foreground">
                Override any component, register custom ones, and adapt the theme to match your brand exactly.
              </p>
            </AnimatedCard>

            <AnimatedCard delay={0.5}>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">High Performance</h3>
              <p className="mt-3 text-muted-foreground">
                Optimized for streaming with flat adjacency lists and minimized re-renders.
              </p>
            </AnimatedCard>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mt-16 max-w-4xl mx-auto sm:mt-24 lg:mt-32" aria-labelledby="quickstart-heading">
          <div className="text-center mb-10">
            <h2 id="quickstart-heading" className="text-3xl font-bold tracking-tight">Drop-in to your app</h2>
            <p className="mt-4 text-muted-foreground">Get started in seconds with your existing Next.js or React project.</p>
          </div>
          
          <div className="grid gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">1. Install Package</h3>
              <CodeBlock
                language="bash"
                code="pnpm add a2ui-shadcn"
              />
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">2. Render Surface</h3>
              <CodeBlock
                language="tsx"
                code={`import { A2UISurface } from 'a2ui-shadcn';

export default function AgentPage() {
  return (
    <div className="h-screen w-full">
      <A2UISurface
        surfaceId="main"
        transport={{ type: 'websocket', url: 'wss://api.example.com/a2ui' }}
      />
    </div>
  );
}`}
              />
            </div>
          </div>
        </section>

        {/* Documentation Links */}
        <section className="mt-16 mb-16 sm:mt-24 sm:mb-20 lg:mt-32" aria-labelledby="docs-heading">
          <h2 id="docs-heading" className="mb-10 text-center text-3xl font-bold tracking-tight">
            Explore Documentation
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/docs/introduction"
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <h3 className="relative mb-2 font-bold group-hover:text-primary">Introduction</h3>
              <p className="relative text-sm text-muted-foreground">
                Learn about A2UI protocol and how a2ui-shadcn works
              </p>
            </Link>
            <Link
              href="/docs/installation"
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <h3 className="relative mb-2 font-bold group-hover:text-primary">Installation</h3>
              <p className="relative text-sm text-muted-foreground">
                Step-by-step setup guide for Next.js and Vite
              </p>
            </Link>
            <Link
              href="/docs/components"
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <h3 className="relative mb-2 font-bold group-hover:text-primary">Components</h3>
              <p className="relative text-sm text-muted-foreground">
                Complete reference of 30+ A2UI components
              </p>
            </Link>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/docs/introduction"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:underline"
            >
              View All Documentation
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
