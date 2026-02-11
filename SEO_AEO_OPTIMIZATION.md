# SEO & AEO Optimization

This document outlines the comprehensive SEO (Search Engine Optimization) and AEO (Answer Engine Optimization) strategies implemented in the a2ui-shadcn documentation site.

## Overview

The a2ui-shadcn documentation site is fully optimized for:
- **Traditional search engines** (Google, Bing, DuckDuckGo, etc.)
- **AI/LLM crawlers** (GPTBot, ClaudeBot, Perplexity, etc.)
- **Answer engines** (ChatGPT, Claude, Perplexity AI, etc.)
- **Social media platforms** (Twitter/X, LinkedIn, Facebook, etc.)

---

## 1. Metadata & SEO Fundamentals

### Root Layout Metadata (`layout.tsx`)

```tsx
- Title template: "%s | a2ui-shadcn"
- Default title: "a2ui-shadcn - A2UI Protocol Renderer for shadcn/ui"
- Comprehensive description (160 chars)
- Extended keywords array (20+ relevant terms)
- Authors, creator, publisher fields
- metadataBase for absolute URLs
- Canonical URLs
- Category and classification
```

### Page-Specific Metadata

Each major page has custom metadata:

- **Homepage**: Hero description, comprehensive keywords
- **Docs**: Article-specific metadata with descriptions
- **Examples**: Playground-specific metadata
- **Component pages**: Individual component descriptions

---

## 2. Open Graph & Social Media

### Dynamic OpenGraph Images

Next.js 16 `ImageResponse` API generates custom OG images:

- **Homepage** (`/opengraph-image`): Dark gradient with logo, title, tech badges
- **Docs** (`/docs/opengraph-image`): Green gradient with book icon, section badges
- **Examples** (`/examples/opengraph-image`): Blue gradient with code editor mockup

Each image:
- 1200×630px (optimal for all platforms)
- Programmatically generated (no static files)
- Theme-consistent branding
- Twitter card support

### Social Media Optimization

```tsx
openGraph: {
  title, description, url, siteName, locale, type, images
}

twitter: {
  card: "summary_large_image",
  title, description, images,
  creator: "@rezashahnazar"
}
```

---

## 3. Structured Data (JSON-LD)

### Root Level (`layout.tsx`)

**WebSite Schema**:
```json
{
  "@type": "WebSite",
  "name": "a2ui-shadcn",
  "url": "https://a2ui-shadcn.shahnazar.me",
  "potentialAction": {
    "@type": "SearchAction"
  }
}
```

### Homepage Schemas

**SoftwareApplication**:
- Application details
- Version, date published
- Operating system, programming language
- License, code repository
- Keywords

**FAQ Schema**:
- 5+ common questions
- What is a2ui-shadcn?
- How to install?
- What is A2UI protocol?
- RTL support?
- Supported components?

**HowTo Schema**:
- Step-by-step integration guide
- Install package → Set up shadcn → Use A2UISurface

**Course Schema**:
- Documentation as learning material
- Online course format
- Estimated time investment

**Organization Schema**:
- Logo, founder, URLs
- GitHub and NPM links

### Documentation Pages

**TechArticle Schema**:
- Article metadata per doc page
- Author, publisher, dates
- Headline, description, URL

**BreadcrumbList Schema**:
- Home → Docs → [Page]
- Hierarchical navigation
- Position-indexed items

---

## 4. Sitemap & Crawling

### Sitemap.xml (`/sitemap.xml`)

Dynamic sitemap with:
- Homepage (priority 1.0)
- Main docs pages (priority 0.9)
- Component pages (priority 0.8)
- Examples (priority 0.8)
- Change frequency hints
- Last modified timestamps

### Robots.txt (`/robots.txt`)

```
User-agent: *
Allow: /

# AI/LLM crawlers explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# ... and more
```

**Crawlers explicitly allowed**:
- GPTBot (OpenAI)
- ChatGPT-User
- ClaudeBot (Anthropic)
- CCBot (Common Crawl)
- Google-Extended
- PerplexityBot
- YouBot

---

## 5. RSS Feed

**RSS 2.0 Feed** (`/rss.xml`):
- All documentation pages
- Titles, descriptions, links
- Publication dates
- Proper XML formatting
- Cached for 1 hour

**Linked in `<head>`**:
```html
<link rel="alternate" type="application/rss+xml" 
      title="a2ui-shadcn Documentation RSS Feed" 
      href="/rss.xml" />
```

---

## 6. Semantic HTML & Accessibility

### HTML5 Semantic Elements

```html
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<article itemScope itemType="https://schema.org/Article">
<section aria-labelledby="...">
<footer>
```

### Schema.org Microdata

```html
<article itemScope itemType="https://schema.org/Article">
  <h1 itemProp="headline">...</h1>
  <p itemProp="description">...</p>
  <meta itemProp="datePublished" content="2026-02-11" />
  <meta itemProp="author" content="Reza Shahnazar" />
  <div itemProp="articleBody">...</div>
</article>
```

### ARIA Attributes

- `aria-label` for navigation
- `aria-labelledby` for sections
- `role` attributes for landmarks
- Proper heading hierarchy (h1→h2→h3)

---

## 7. PWA & Manifest

**Web App Manifest** (`/manifest.json`):
```json
{
  "name": "a2ui-shadcn - A2UI Protocol Renderer for shadcn/ui",
  "short_name": "a2ui-shadcn",
  "description": "...",
  "start_url": "/",
  "display": "standalone",
  "icons": [...],
  "categories": ["development", "productivity", "utilities"]
}
```

**Favicon** (`/icon.png`):
- Automatically served as favicon by Next.js 16
- 512×512px PNG with transparency
- High-quality branding

---

## 8. Performance & Caching

### Next.js Configuration

**Image Optimization**:
```ts
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
}
```

**HTTP Headers**:
- `X-DNS-Prefetch-Control: on`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- Long cache for static assets (1 year)

**Compression**:
- Gzip/Brotli enabled
- Optimized bundle sizes

---

## 9. Branding & Visual Identity

### Logo Integration

- **Header**: Logo + text in navigation
- **Homepage**: Large centered logo with animation
- **Public folder**: Accessible at `/images/logo.png`
- **Structured data**: Referenced in Organization schema

### Favicon

- **Path**: `/icon.png` (Next.js 16 convention)
- **Format**: PNG with transparency
- **Size**: 512×512px
- **Auto-generated** sizes by Next.js

---

## 10. Answer Engine Optimization (AEO)

### LLM-Friendly Content Structure

**Clear hierarchies**:
- Semantic HTML5 tags
- Proper heading levels
- Descriptive link text
- Code examples with context

**Structured data for understanding**:
- FAQ schema for common questions
- HowTo schema for tutorials
- Course schema for learning paths
- Breadcrumbs for navigation context

**Comprehensive metadata**:
- Detailed descriptions
- Keyword-rich content
- Alt text for images
- Schema.org microdata

### Explicit AI Crawler Support

All major AI/LLM crawlers are explicitly allowed in `robots.txt` with no restrictions, ensuring:
- ChatGPT can index and reference the docs
- Claude can access documentation
- Perplexity can cite the site
- Google Extended can train on content

---

## 11. Content Quality Signals

### E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

**Expertise**:
- Comprehensive technical documentation
- Code examples with best practices
- Deep dive into A2UI protocol

**Authoritativeness**:
- Open source (GitHub)
- Published on NPM
- Professional documentation site

**Trustworthiness**:
- Accurate metadata
- Security headers
- HTTPS enforced
- Privacy-respecting (no tracking)

### Content Depth

- 10+ documentation pages
- 30+ component references
- Interactive examples
- Code snippets
- Visual diagrams

---

## 12. Technical SEO Checklist

✅ **Indexing**
- Sitemap.xml
- Robots.txt
- Canonical URLs
- Meta robots tags

✅ **Performance**
- Image optimization (AVIF, WebP)
- Code splitting
- Lazy loading
- Caching headers

✅ **Mobile**
- Responsive design
- Touch-friendly UI
- Fast mobile load times

✅ **Security**
- HTTPS enforced
- Security headers
- No mixed content

✅ **Structured Data**
- Multiple schema types
- Valid JSON-LD
- Breadcrumbs
- Organization info

✅ **Social**
- Open Graph tags
- Twitter Cards
- Dynamic OG images
- Social links

✅ **Accessibility**
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support

✅ **Content**
- Unique titles
- Meta descriptions
- Header hierarchy
- Internal linking

---

## 13. Monitoring & Validation

### Tools for Validation

**Structured Data**:
- Google Rich Results Test
- Schema.org Validator
- JSON-LD Playground

**SEO**:
- Google Search Console
- Lighthouse CI
- PageSpeed Insights

**Social Media**:
- Twitter Card Validator
- Facebook Sharing Debugger
- LinkedIn Post Inspector

**Accessibility**:
- WAVE Web Accessibility Tool
- axe DevTools
- Lighthouse Accessibility Audit

---

## 14. Future Enhancements

Potential improvements:

- [ ] Google Analytics 4 (optional)
- [ ] Vercel Analytics (optional)
- [ ] Video content (YouTube embeds)
- [ ] Multi-language support (i18n)
- [ ] Blog section for updates
- [ ] Changelog with RSS
- [ ] API reference search
- [ ] Dark/light mode preference in OG images

---

## Summary

The a2ui-shadcn documentation site implements **best-in-class SEO and AEO practices**:

1. **Comprehensive metadata** for all pages
2. **Dynamic OpenGraph images** with Next.js 16
3. **Rich structured data** (8+ schema types)
4. **AI/LLM crawler support** (robots.txt + allowlist)
5. **RSS feed** for documentation
6. **PWA manifest** and favicon
7. **Performance optimization** (images, caching, compression)
8. **Semantic HTML** with Schema.org microdata
9. **Accessibility** (ARIA, roles, keyboard nav)
10. **Security headers** and HTTPS

This ensures maximum discoverability by:
- Traditional search engines (Google, Bing)
- AI chatbots (ChatGPT, Claude, Perplexity)
- Social media platforms (Twitter, LinkedIn, Facebook)
- Developer communities (GitHub, NPM)

**Result**: The documentation is fully optimized for both human developers and AI systems to discover, understand, and reference.
