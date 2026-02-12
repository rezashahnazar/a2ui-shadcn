import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "a2ui-shadcn - A2UI Protocol Renderer for shadcn/ui",
    template: "%s | a2ui-shadcn",
  },
  description: "Production-grade npm package mapping A2UI protocol v0.9 to shadcn/ui components. Build dynamic, agent-driven UIs with React, TypeScript, and Tailwind CSS. Full RTL support, reactive data binding, 30+ components.",
  keywords: [
    "a2ui",
    "agent-to-ui",
    "shadcn",
    "shadcn/ui",
    "react",
    "typescript",
    "tailwind css",
    "ui components",
    "protocol",
    "agent-driven ui",
    "ai ui",
    "next.js",
    "rtl support",
    "reactive binding",
    "websocket",
    "streaming ui",
    "declarative ui",
    "json protocol",
    "component library",
    "design system",
  ],
  authors: [{ name: "Reza Shahnazar", url: "https://github.com/rezashahnazar" }],
  creator: "Reza Shahnazar",
  publisher: "Reza Shahnazar",
  metadataBase: new URL("https://a2ui-shadcn.shahnazar.me"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "a2ui-shadcn - A2UI Protocol Renderer for shadcn/ui",
    description: "Production-grade npm package mapping A2UI protocol to shadcn/ui components. Build agent-driven UIs with React and shadcn/ui.",
    url: "https://a2ui-shadcn.shahnazar.me",
    siteName: "a2ui-shadcn",
    locale: "en_US",
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
    description: "Production-grade npm package mapping A2UI protocol to shadcn/ui components",
    images: ["/opengraph-image"],
    creator: "@rezashahnazar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Software Development",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://a2ui-shadcn.shahnazar.me" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="a2ui-shadcn Documentation RSS Feed"
          href="/rss.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "a2ui-shadcn",
              "description": "Production-grade npm package mapping A2UI protocol to shadcn/ui components",
              "url": "https://a2ui-shadcn.shahnazar.me",
              "author": {
                "@type": "Person",
                "name": "Reza Shahnazar",
                "url": "https://github.com/rezashahnazar",
              },
              "publisher": {
                "@type": "Organization",
                "name": "a2ui-shadcn",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://a2ui-shadcn.shahnazar.me/images/logo.png",
                },
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://a2ui-shadcn.shahnazar.me/docs?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main role="main">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
