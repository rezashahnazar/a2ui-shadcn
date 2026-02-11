import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { DocContent } from "@/components/doc-content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { generateBreadcrumbSchema, generateArticleSchema } from "@/lib/structured-data";
import { docsContent } from "@/lib/docs-content";

// Define the order of documentation sections for navigation
const docOrder = [
  "introduction",
  "installation",
  "usage",
  "components",
  "actions",
  "transport",
  "theming",
  "rtl",
  "custom",
  "api",
];

function getAdjacentDocs(currentSlug: string) {
  const currentIndex = docOrder.indexOf(currentSlug);
  const prevSlug = currentIndex > 0 ? docOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < docOrder.length - 1 ? docOrder[currentIndex + 1] : null;
  
  return {
    prev: prevSlug ? { slug: prevSlug, ...docsContent[prevSlug] } : null,
    next: nextSlug ? { slug: nextSlug, ...docsContent[nextSlug] } : null,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slug = slugArray?.join("/") || "introduction";
  const doc = docsContent[slug];
  
  if (!doc) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: `/docs/${slug}`,
    },
    openGraph: {
      title: `${doc.title} | a2ui-shadcn`,
      description: doc.description,
      url: `https://a2ui-shadcn.shahnazar.me/docs/${slug}`,
      type: "article",
    },
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug: slugArray } = await params;
  const slug = slugArray?.join("/") || "introduction";
  const doc = docsContent[slug];
  if (!doc) notFound();

  const { prev, next } = getAdjacentDocs(slug);

  const breadcrumbItems = [
    { name: "Home", url: "https://a2ui-shadcn.shahnazar.me" },
    { name: "Docs", url: "https://a2ui-shadcn.shahnazar.me/docs/introduction" },
    { name: doc.title, url: `https://a2ui-shadcn.shahnazar.me/docs/${slug}` },
  ];

  const articleSchema = generateArticleSchema({
    title: doc.title,
    description: doc.description,
    url: `https://a2ui-shadcn.shahnazar.me/docs/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6" itemScope itemType="https://schema.org/Article">
        <Breadcrumbs />
        
        {/* Mobile nav pills */}
        <div className="mb-8 flex flex-wrap gap-2 lg:hidden">
          {Object.entries(docsContent).map(([k, { title }]) => (
            <Link
              key={k}
              href={`/docs/${k}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                k === slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {title}
            </Link>
          ))}
        </div>

        <header className="mt-8 border-b border-border pb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight" itemProp="headline">{doc.title}</h1>
          <p className="text-lg leading-relaxed text-muted-foreground" itemProp="description">{doc.description}</p>
          <meta itemProp="datePublished" content="2026-02-11" />
          <meta itemProp="author" content="Reza Shahnazar" />
        </header>

        <div className="mt-8" itemProp="articleBody">
          <DocContent content={doc.content} />
        </div>

        {/* Navigation footer - Previous and Next */}
        <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
          <div>
            {prev ? (
              <Link
                href={`/docs/${prev.slug}`}
                className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-primary"
              >
                <svg className="size-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="text-start">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium">{prev.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
          <div>
            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-primary"
              >
                <div className="text-end">
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="font-medium">{next.title}</div>
                </div>
                <svg className="size-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </article>
    </>
  );
}
