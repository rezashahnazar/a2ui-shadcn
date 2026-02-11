# a2ui-shadcn

A production-grade npm package that maps the [A2UI (Agent-to-User-Interface)](https://a2ui.org) protocol v0.9 to shadcn/ui components. Build dynamic, agent-driven UIs with React and Tailwind CSS.

🌐 **[Live Demo & Documentation](https://a2ui-shadcn.shahnazar.me)**

## Monorepo Structure

```
a2ui-shadcn/
├── packages/
│   └── a2ui-shadcn/     # Core renderer package
├── apps/
│   └── docs/            # Next.js 16 documentation site
└── pnpm-workspace.yaml
```

## Quick Start

```bash
pnpm install
pnpm dev           # Start docs site at http://localhost:3000
pnpm build         # Build package and docs
pnpm build:package # Build package only
pnpm publish:package  # Publish package to npm (from packages/a2ui-shadcn)
pnpm lint          # Lint all packages
```

## Package: a2ui-shadcn

### Installation

```bash
pnpm add a2ui-shadcn
```

### Usage

```tsx
import { A2UISurface } from 'a2ui-shadcn';

<A2UISurface
  surfaceId="dashboard"
  transport={{ type: 'websocket', url: 'wss://api.example.com/a2ui' }}
  onAction={(action) => console.log(action)}
/>
```

### Features

- Full A2UI v0.9 compliance (createSurface, updateComponents, updateDataModel)
- 30+ component adapters (Button, Text, Column, Row, TextField, etc.)
- Reactive data model with JSON Pointer support
- Two-way binding for input components
- Transport adapters: WebSocket, SSE, Manual
- RTL layout support
- Theming and custom component registry

## Docs Site

The documentation site (`apps/docs`) features a professionally designed, comprehensive documentation experience:

### Features

**Professional Code Editor**
- Monaco Editor integration for the playground
- Full syntax highlighting and IntelliSense
- Auto-formatting and bracket matching
- Theme-aware (light/dark mode)
- No hydration warnings

**Enhanced Documentation**
- Comprehensive guide covering all A2UI concepts
- 10+ detailed documentation pages (Introduction, Installation, Usage, Components, Actions, Transport, Theming, RTL, Custom Components, API Reference)
- **Actions & Reactive Behavior** – diagram and explanation of how user actions trigger reactive component behavior (two-way binding, context resolution, onAction handling)
- **Component subsection with individual pages** - Each A2UI component has a dedicated page with:
  - Complete prop reference table
  - Multiple interactive examples
  - Live previews using actual a2ui-shadcn package
  - Show/hide code toggle
  - Expandable navigation with categories
- Interactive code examples with syntax highlighting
- Info boxes for tips, warnings, and notes
- **Mobile-responsive header** – hamburger menu with slide-in panel on small screens
- **Docs sidebar** – collapsible drawer on mobile, sticky sidebar on desktop
- Homepage links to all documentation sections

**Interactive Playground (IDE-style)**
- **Resizable 4-panel layout** – Examples sidebar | JSON editor | Live preview | Inspector (desktop)
- **Examples sidebar** – organized by category with ScrollArea, always visible on desktop, dropdown on mobile
- Monaco Editor for JSON editing with syntax highlighting
- **8+ pre-built reactive examples** – Counter, Forms, Dashboard, Chat UI, Data Binding, and more
- Category-organized examples (Basic, Forms, Layout, Real Use Cases, Advanced)
- **All examples use sendDataModel:true** – full data model sent with actions for inspection
- **Reactive Flow Demos** – two-way binding, action context resolution, live data updates
- Live reactive preview with A2UISurface
- **Vertical inspector sections** – Actions, Data Model, Timeline (no tabs, all visible)
- Real-time data model display (merges updateDataModel messages + action snapshots)
- **Mobile-optimized** – improved touch targets (py-3, active:scale-95), smooth transitions
- Format JSON button with better mobile touch target
- Real-time validation and error display

**Design & UX**
- Animated components with Framer Motion
- Shimmer effects and loading states (tw-shimmer)
- Grid patterns and sparkle animations
- Professional theme toggle (next-themes)
- Responsive design for all screen sizes
- Dark mode support throughout

**Code Presentation**
- VS Code-quality syntax highlighting (react-syntax-highlighter)
- Copy-to-clipboard functionality
- Language badges
- Line numbers (optional)
- Theme-aware code blocks

Built with Next.js 16, Tailwind CSS v4, shadcn/ui, Monaco Editor, Framer Motion, next-themes, and react-syntax-highlighter.

**Live Site:** [https://a2ui-shadcn.shahnazar.me](https://a2ui-shadcn.shahnazar.me)

**Local Development:** Run `pnpm dev` and open http://localhost:3000

## Theme System

Professional dark/light mode toggle with:

- ✅ Smooth transitions using Framer Motion
- ✅ System preference detection
- ✅ Persistent theme selection (localStorage)
- ✅ Theme-aware code syntax highlighting
- ✅ No flash of unstyled content (FOUC)
- ✅ Accessible toggle button in header

Powered by `next-themes`. See [THEME_IMPLEMENTATION.md](./THEME_IMPLEMENTATION.md) for details.

## SEO & AEO Optimization

The documentation site is fully optimized for search engines and AI/LLM crawlers:

- ✅ Comprehensive metadata and Open Graph tags
- ✅ Dynamic OpenGraph images for homepage, docs, and examples
- ✅ Structured data (JSON-LD): WebSite, SoftwareApplication, FAQ, HowTo, Course, Organization, Article, and Breadcrumb schemas
- ✅ Sitemap.xml with proper priorities
- ✅ RSS feed for documentation updates
- ✅ Robots.txt with AI crawler permissions (GPTBot, ClaudeBot, Perplexity, etc.)
- ✅ Semantic HTML with ARIA attributes and Schema.org microdata
- ✅ Breadcrumb navigation on all pages
- ✅ Web manifest for PWA support
- ✅ Favicon and app icons (icon.png)
- ✅ Logo integration in header and homepage
- ✅ LLM-friendly content structure
- ✅ Answer Engine Optimization (AEO)
- ✅ Enhanced security and caching headers

See [SEO_AEO_OPTIMIZATION.md](./SEO_AEO_OPTIMIZATION.md) for full details.

## Author

**Reza Shahnazar** — [GitHub](https://github.com/rezashahnazar)

## License

MIT
