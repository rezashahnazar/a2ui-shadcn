import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { componentDocs, getAllComponentSlugs } from "@/lib/component-docs";
import { ComponentPreview } from "@/components/component-preview";

export async function generateStaticParams() {
  return getAllComponentSlugs().map((component) => ({
    component,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ component: string }> }): Promise<Metadata> {
  const { component } = await params;
  const doc = componentDocs[component];
  
  if (!doc) {
    return { title: "Not Found" };
  }

  return {
    title: `${doc.name} Component`,
    description: doc.description,
    alternates: {
      canonical: `/docs/components/${component}`,
    },
    openGraph: {
      title: `${doc.name} Component | a2ui-shadcn`,
      description: doc.description,
      url: `https://a2ui-shadcn.shahnazar.me/docs/components/${component}`,
      type: "article",
    },
  };
}

export default async function ComponentPage({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;
  const doc = componentDocs[component];
  
  if (!doc) notFound();

  const breadcrumbItems = [
    { name: "Home", url: "https://a2ui-shadcn.shahnazar.me" },
    { name: "Docs", url: "https://a2ui-shadcn.shahnazar.me/docs/introduction" },
    { name: "Components", url: "https://a2ui-shadcn.shahnazar.me/docs/components" },
    { name: doc.name, url: `https://a2ui-shadcn.shahnazar.me/docs/components/${component}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbItems)),
        }}
      />
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6" itemScope itemType="https://schema.org/Article">
        <Breadcrumbs />

        <header className="mt-8 border-b border-border pb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium">
            {doc.category}
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight" itemProp="headline">
            {doc.name}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground" itemProp="description">
            {doc.description}
          </p>
          <meta itemProp="datePublished" content="2026-02-11" />
          <meta itemProp="author" content="Reza Shahnazar" />
        </header>

        <div className="mt-12" itemProp="articleBody">
          {/* Props Table */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Properties</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-start font-semibold">Name</th>
                    <th className="px-4 py-3 text-start font-semibold">Type</th>
                    <th className="px-4 py-3 text-start font-semibold">Required</th>
                    <th className="px-4 py-3 text-start font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {doc.props.map((prop, i) => (
                    <tr key={prop.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="px-4 py-3 font-mono text-xs font-medium">{prop.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{prop.type}</td>
                      <td className="px-4 py-3">
                        {prop.required ? (
                          <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                            Yes
                          </span>
                        ) : (
                          <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {prop.description}
                        {prop.default && (
                          <span className="ml-2 font-mono text-xs">
                            (default: <code className="rounded bg-muted px-1 py-0.5">{prop.default}</code>)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Examples */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Examples</h2>
            <div className="space-y-12">
              {doc.examples.map((example, index) => (
                <ComponentPreview
                  key={index}
                  title={example.title}
                  description={example.description}
                  json={example.json}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Navigation footer */}
        <div className="mt-16 border-t border-border pt-8">
          <Link
            href="/docs/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Components
          </Link>
        </div>
      </article>
    </>
  );
}
