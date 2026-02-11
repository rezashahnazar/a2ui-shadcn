# Component Subsection Implementation

## Overview

The documentation now includes a comprehensive **Component Subsection** where each A2UI component has its own dedicated page with detailed documentation, props reference, and live interactive examples powered by the actual `a2ui-shadcn` package.

## Features

### 🎯 Individual Component Pages

Each component has a dedicated route at `/docs/components/[component]` with:

- **Component Overview**: Category badge and full description
- **Props Table**: Complete reference with type information, required flags, and default values
- **Multiple Examples**: 2-3 real-world usage examples per component
- **Live Previews**: Each example renders using the actual `A2UISurface` component
- **Show/Hide Code**: Toggle to view the A2UI JSON behind each example
- **SEO Optimized**: Proper metadata, Open Graph tags, and JSON-LD structured data

### 📁 Component Coverage (Initial Set)

**Layout Components**
- Column - Vertical flex container
- Row - Horizontal flex container
- Card - Content card with styling

**Content Components**
- Text - Typography with semantic variants

**Input Components**
- TextField - Text input with validation
- CheckBox - Boolean selection

**Interactive Components**
- Button - Clickable button with variants

**Feedback Components**
- Badge - Status and tag labels

### 🧭 Enhanced Navigation

The documentation sidebar now includes:

- **Expandable Components Section**: Click "Components" to expand/collapse
- **Category Organization**: Components grouped by type (Layout, Content, Input, etc.)
- **Active Highlighting**: Current component page is highlighted
- **Auto-expand on Component Pages**: Navigation automatically expands when viewing a component page

### 📄 File Structure

```
apps/docs/src/
├── lib/
│   └── component-docs.ts                    # Component documentation data
├── app/
│   └── docs/
│       └── components/
│           └── [component]/
│               └── page.tsx                 # Dynamic component page
├── components/
│   ├── component-preview.tsx                # Preview component with show/hide code
│   └── doc-nav.tsx                          # Enhanced navigation with expansion
└── sitemap.ts                               # Updated to include component routes
```

## Implementation Details

### 1. Component Documentation Data (`component-docs.ts`)

Centralized data structure for all components:

```typescript
export interface ComponentDoc {
  name: string;
  category: string;
  description: string;
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    default?: string;
  }>;
  examples: Array<{
    title: string;
    description: string;
    json: string;
  }>;
}
```

### 2. Component Page Template (`[component]/page.tsx`)

Dynamic Next.js route that:
- Uses `generateStaticParams()` to pre-render all component pages at build time
- Fetches component data from `componentDocs`
- Generates SEO metadata automatically
- Renders props table and interactive examples
- Includes breadcrumb navigation and back link

### 3. Component Preview (`component-preview.tsx`)

Reusable component that:
- Parses A2UI JSON messages
- Renders live preview using `<A2UISurface>`
- Provides show/hide code toggle
- Displays Monaco Editor for JSON code
- Handles errors gracefully
- Supports action handling with alerts

### 4. Navigation Enhancement (`doc-nav.tsx`)

Updated sidebar navigation:
- Detects when on a component page and auto-expands
- Clickable "Components" item with expand/collapse
- Nested component list organized by category
- Smooth animations with Framer Motion
- Active state highlighting for current component

### 5. SEO & Sitemap

All component pages are:
- Included in `sitemap.xml` with priority 0.8
- Have proper meta tags and Open Graph data
- Include JSON-LD structured data (breadcrumbs, article schema)
- Canonical URLs for each component

## Usage Example

Users can navigate to any component page:

```
https://a2ui-shadcn.shahnazar.me/docs/components/button
https://a2ui-shadcn.shahnazar.me/docs/components/textfield
https://a2ui-shadcn.shahnazar.me/docs/components/column
```

Each page provides:
1. Complete prop reference
2. 2-3 interactive examples
3. Live previews with real component rendering
4. Ability to view and copy the JSON code

## Build Output

```
Route (app)
├── ● /docs/components/[component]
│   ├── /docs/components/column
│   ├── /docs/components/row
│   ├── /docs/components/button
│   ├── /docs/components/text
│   ├── /docs/components/textfield
│   ├── /docs/components/checkbox
│   ├── /docs/components/card
│   └── /docs/components/badge
```

All pages are **statically generated (SSG)** at build time for optimal performance.

## Adding New Components

To add documentation for a new component:

1. Add entry to `componentDocs` in `component-docs.ts`:
   ```typescript
   newcomponent: {
     name: "NewComponent",
     category: "Interactive",
     description: "Component description...",
     props: [ /* ... */ ],
     examples: [ /* ... */ ],
   }
   ```

2. Update category mapping if needed in `componentCategories`

3. Build the site - the page will be auto-generated

## Future Enhancements

Potential additions:
- Add all 30+ components from the catalog
- Search functionality for components
- Component comparison view
- Copy individual example JSON with one click
- Edit and preview examples inline
- Export examples to CodeSandbox/StackBlitz
- Related components recommendations
- Component usage statistics

## Benefits

✅ **Developer Experience**: Quick reference for all component props  
✅ **Learning by Example**: Multiple real-world examples per component  
✅ **Interactive**: See components in action with live previews  
✅ **SEO Friendly**: Individual pages rank for component-specific searches  
✅ **Maintainable**: Centralized data structure for easy updates  
✅ **Scalable**: Easy to add new components as they're implemented  
✅ **Type Safe**: Full TypeScript support for component documentation  

---

**Status**: ✅ Complete and deployed

Component subsection is fully functional with 8 components documented, navigation integration, and live preview support.
