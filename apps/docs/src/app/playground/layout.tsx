import { PlaygroundHeader } from "@/components/playground-header";
import { PlaygroundViewportController } from "@/components/playground-viewport-controller";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Interactive Playground",
  description: "Try a2ui-shadcn in action with live examples. Edit A2UI JSON and see real-time UI updates with interactive components, actions, and data binding.",
  keywords: [
    "a2ui playground",
    "live examples",
    "interactive demo",
    "json editor",
    "component preview",
    "agent ui demo",
  ],
  alternates: {
    canonical: "/playground",
  },
  openGraph: {
    title: "Interactive Playground | a2ui-shadcn",
    description: "Try a2ui-shadcn in action with live examples. Edit A2UI JSON and see real-time UI updates.",
    url: "https://a2ui-shadcn.shahnazar.me/playground",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "a2ui-shadcn Interactive Playground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Playground | a2ui-shadcn",
    description: "Try a2ui-shadcn in action with live examples",
    images: ["/opengraph-image"],
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PlaygroundViewportController />
      <div className="playground-full-viewport fixed inset-0 flex w-full max-w-full flex-col overflow-hidden pt-[env(safe-area-inset-top)]">
        <PlaygroundHeader />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </>
  );
}
