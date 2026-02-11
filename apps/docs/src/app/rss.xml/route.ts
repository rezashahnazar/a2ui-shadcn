import { docsContent } from "@/lib/docs-content";

export async function GET() {
  const baseUrl = "https://a2ui-shadcn.shahnazar.me";
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>a2ui-shadcn Documentation</title>
    <link>${baseUrl}</link>
    <description>Production-grade npm package mapping A2UI protocol v0.9 to shadcn/ui components. Build dynamic, agent-driven UIs with React, TypeScript, and Tailwind CSS.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${Object.entries(docsContent)
      .map(
        ([slug, doc]) => `
    <item>
      <title>${doc.title}</title>
      <link>${baseUrl}/docs/${slug}</link>
      <description>${doc.description}</description>
      <pubDate>Mon, 11 Feb 2026 00:00:00 GMT</pubDate>
      <guid>${baseUrl}/docs/${slug}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
