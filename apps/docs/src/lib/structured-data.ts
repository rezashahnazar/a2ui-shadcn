/* eslint-disable @typescript-eslint/no-explicit-any */

export const websiteSchema: any = {
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
  "inLanguage": "en",
  "copyrightYear": 2026,
};

export const softwareSchema: any = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "a2ui-shadcn",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "description": "A production-grade npm package that maps the A2UI (Agent-to-User-Interface) protocol v0.9 to shadcn/ui components. Build dynamic, agent-driven UIs with React and Tailwind CSS.",
  "url": "https://a2ui-shadcn.shahnazar.me",
  "softwareVersion": "0.1.0",
  "datePublished": "2026-02-11",
  "author": {
    "@type": "Person",
    "name": "Reza Shahnazar",
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "programmingLanguage": {
    "@type": "ComputerLanguage",
    "name": "TypeScript",
  },
  "license": "https://opensource.org/licenses/MIT",
  "codeRepository": "https://github.com/rezashahnazar/a2ui-shadcn",
  "keywords": [
    "a2ui",
    "agent-to-ui",
    "shadcn",
    "react",
    "ui",
    "protocol",
    "agent-driven",
    "typescript",
    "tailwind",
    "next.js",
  ],
};

export const organizationSchema: any = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "a2ui-shadcn",
  "url": "https://a2ui-shadcn.shahnazar.me",
  "logo": {
    "@type": "ImageObject",
    "url": "https://a2ui-shadcn.shahnazar.me/images/logo.png",
    "width": 512,
    "height": 512,
  },
  "sameAs": [
    "https://github.com/rezashahnazar/a2ui-shadcn",
    "https://www.npmjs.com/package/a2ui-shadcn",
  ],
  "founder": {
    "@type": "Person",
    "name": "Reza Shahnazar",
    "url": "https://github.com/rezashahnazar",
  },
};

export const faqSchema: any = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a2ui-shadcn?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "a2ui-shadcn is a production-grade npm package that maps the A2UI (Agent-to-User-Interface) protocol v0.9 to shadcn/ui components. It allows you to build dynamic, agent-driven user interfaces using React and Tailwind CSS.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I install a2ui-shadcn?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can install a2ui-shadcn using npm, pnpm, or yarn: 'pnpm add a2ui-shadcn' or 'npm install a2ui-shadcn' or 'yarn add a2ui-shadcn'.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the A2UI protocol?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A2UI (Agent-to-User-Interface) is a JSON-based streaming protocol that allows AI agents or backend services to declaratively generate and update user interfaces. Instead of agents generating code, they emit structured JSON messages that client renderers interpret and display.",
      },
    },
    {
      "@type": "Question",
      "name": "Does a2ui-shadcn support RTL layouts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, a2ui-shadcn includes full right-to-left (RTL) layout support for Arabic, Hebrew, Persian, and other RTL languages. You can set the direction via the 'dir' prop on the A2UISurface component.",
      },
    },
    {
      "@type": "Question",
      "name": "What components are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "a2ui-shadcn supports 30+ component types from the A2UI v0.9 catalog, including layout components (Column, Row, Card, Tabs), content components (Text, Image, Markdown), input components (TextField, CheckBox, Slider), and more.",
      },
    },
  ],
};

export const howToSchema: any = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to use a2ui-shadcn",
  "description": "A step-by-step guide to integrating a2ui-shadcn into your Next.js or React project",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Install the package",
      "text": "Install a2ui-shadcn using pnpm, npm, or yarn: pnpm add a2ui-shadcn",
      "url": "https://a2ui-shadcn.shahnazar.me/docs/installation",
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Set up shadcn/ui",
      "text": "Initialize shadcn/ui in your project if not already done: npx shadcn@latest init",
      "url": "https://a2ui-shadcn.shahnazar.me/docs/installation",
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Use the A2UISurface component",
      "text": "Import and use the A2UISurface component in your React app to render A2UI messages",
      "url": "https://a2ui-shadcn.shahnazar.me/docs/usage",
    },
  ],
};

export const courseSchema: any = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "a2ui-shadcn Complete Guide",
  "description": "Comprehensive documentation and tutorials for using a2ui-shadcn to build agent-driven UIs",
  "provider": {
    "@type": "Organization",
    "name": "a2ui-shadcn",
    "url": "https://a2ui-shadcn.shahnazar.me",
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT2H",
  },
};

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "datePublished": article.datePublished || "2026-02-11",
    "dateModified": article.dateModified || new Date().toISOString(),
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
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url,
    },
  };
}
