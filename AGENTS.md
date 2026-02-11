# Project Brief: A2UI-shadcn Renderer Package

You are tasked with building a production-grade, fully-engineered npm package that maps shadcn/ui components to the A2UI (Agent-to-User-Interface) protocol specification v0.9. This will be delivered as a **pnpm monorepo** with the package itself and a Next.js 16 documentation/showcase website.

A boilerplate of a Next.js 16 project with TypeScript, Tailwind CSS v4, App Router, src, React Compiler, and **shadcn/ui initialized** as the base. The **main Next.js project** (root app and docs site) must be built on shadcn/ui: use shadcn components for all UI elements (navigation, layout, forms, buttons, etc.). You should do the rest.

---

## Background: What is A2UI?

**A2UI (Agent to UI Protocol)** is a JSON-based streaming protocol that allows AI agents or backend services to declaratively generate and update user interfaces. Instead of agents generating code, they emit structured JSON messages that client renderers interpret and display.

### Core Concepts

1. **Protocol Messages** (v0.9 spec):
   - `createSurface`: Initializes a UI surface with a catalog of available components, optional theme tokens, and configuration.
   - `updateComponents`: Sends/updates component definitions as a flat adjacency list (not nested trees). Each component has an `id`, a `component` type (e.g., `"Button"`, `"Text"`), properties, and a `children` array of child IDs.
   - `updateDataModel`: Updates application state at a JSON Pointer path (e.g., `/user/name`). Components can bind to these paths for reactive updates.
   - `action` (client→server): User interactions (button clicks, form submissions) send structured action messages back to the agent with resolved context.

2. **Component Catalog**: A predefined set of component types with schemas (props, allowed children, binding behavior). The v0.9 catalog includes:
   - **Layout**: `Column`, `Row`, `Box`, `Card`, `Accordion`, `Tabs`, `Carousel`
   - **Content**: `Text`, `Image`, `Icon`, `Video`, `Audio`, `Markdown`, `CodeBlock`, `Divider`
   - **Input**: `TextField`, `CheckBox`, `Switch`, `Slider`, `ChoicePicker`, `DateTimeInput`, `FileUpload`
   - **Interactive**: `Button`, `Link`, `Menu`
   - **Data**: `DataTable`, `List`
   - **Feedback**: `ProgressIndicator`, `Badge`, `Snackbar`
   - **Navigation**: `AppBar`, `NavigationDrawer`, `BottomNavigation`

3. **Data Binding**: Component properties can reference data model paths using `{ "path": "/some/key" }`. When the data model updates, bound components automatically re-render.

4. **Two-Way Binding**: Input components (`TextField`, `CheckBox`, etc.) read from and write to the local data model in real-time. Changes are only sent to the server when an action is triggered.

5. **Theming**: Agents can send a `theme` object with semantic tokens (colors, typography, spacing, shapes). The **client renderer decides how to interpret these** and apply them via its design system. A2UI does not dictate exact CSS values.

6. **Action Handling**: Buttons and interactive components have an `action` property with either:
   - `event`: triggers a client→server action message with resolved context.
   - `functionCall`: executes a registered client-side function (e.g., `openUrl`).

7. **Validation**: Components can include `checks` (client-side validation functions like `required`, `regex`, `minLength`) that disable buttons or show error messages.

8. **Transport Agnostic**: A2UI defines the message format but not the transport. Common transports: WebSocket, SSE, A2A protocol, REST.

### Key Design Principles
- **Declarative**: Agents describe structure and data, not imperative code.
- **Separation of concerns**: UI structure (`updateComponents`) is separate from application state (`updateDataModel`).
- **Client-controlled styling**: Agents provide semantic hints; clients enforce brand and accessibility.
- **Flat adjacency list**: Components are sent as a flat array with ID references for children (not nested JSON trees), making it LLM-friendly and streamable.

### Official Spec References
- **v0.9 Specification**: https://a2ui.org/specification/v0.9-a2ui/
- **Core Concepts**: https://a2ui.org/concepts/overview/
- **Theming Guide**: https://a2ui.org/guides/theming/

---

## Project Requirements

### Monorepo Structure

Use **pnpm workspaces** with the following packages:

```
a2ui-shadcn/
├── packages/
│   └── a2ui-shadcn/          # Core renderer package
│       ├── src/
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
├── apps/
│   └── docs/                 # Next.js 16 docs site
│       ├── app/
│       ├── components/
│       ├── content/          # MDX docs
│       ├── public/
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       └── tailwind.config.ts (v4)
├── pnpm-workspace.yaml
├── package.json
├── turbo.json (optional, for build orchestration)
└── README.md
```

---

## Package: `a2ui-shadcn`

### Goals
- **Full A2UI v0.9 compliance**: Support all component types in the catalog.
- **shadcn/ui integration**: Map A2UI components to shadcn/ui primitives.
- **RTL support**: Full right-to-left layout support for Arabic, Hebrew, Persian, and other RTL languages. See [SHADCN_RTL.md](./SHADCN_RTL.md) for implementation details.
- **Tailwind CSS v4**: Fully compatible with Tailwind v4 theming and utilities.
- **TypeScript-first**: Strongly typed APIs for surfaces, components, actions, and data models.
- **Framework flexibility**: Work seamlessly in Next.js (App Router + Pages Router) and Vite projects.
- **Customizability**: Allow users to override component mappings, register custom components, and extend the catalog.
- **Data model reactivity**: Provide a built-in reactive store for the A2UI data model (using Zustand or similar).
- **Transport agnostic**: Support WebSocket, SSE, and manual JSON message ingestion.

### Core API

#### 1. `<A2UISurface>` Component

The main React component that consumes A2UI messages and renders the UI.

```tsx
import { A2UISurface } from 'a2ui-shadcn';

<A2UISurface
  surfaceId="main_surface"
  transport={{
    type: 'websocket',
    url: 'wss://agent.example.com/a2ui',
  }}
  onAction={(action) => {
    // Handle client-to-server actions
    console.log('Action triggered:', action);
  }}
  theme={{
    // Optional: Override default shadcn theme mappings
    primary: 'hsl(222.2 47.4% 11.2%)',
    radius: 'md',
  }}
  componentRegistry={{
    // Optional: Extend or override component mappings
    CustomChart: MyCustomChartComponent,
  }}
  dir="ltr"
  className="w-full h-full"
/>
```

#### 2. `useA2UIDataModel` Hook

Access and update the reactive data model for a surface.

```tsx
import { useA2UIDataModel } from 'a2ui-shadcn';

function MyComponent() {
  const [value, setValue] = useA2UIDataModel('/user/name');
  return <div>{value}</div>;
}
```

#### 3. `registerFunction` API

Register custom client-side functions for `functionCall` actions.

```tsx
import { registerFunction } from 'a2ui-shadcn';

registerFunction('openUrl', ({ url }) => {
  window.open(url, '_blank');
});

registerFunction('showAlert', ({ message }) => {
  alert(message);
});
```

#### 4. `A2UIProvider` Context

Wrap your app to provide global configuration (transport, theme, registry).

```tsx
import { A2UIProvider } from 'a2ui-shadcn';

<A2UIProvider
  defaultTheme={{ primary: '...', radius: 'md' }}
  defaultDir="ltr"
  functions={{
    openUrl: ({ url }) => window.open(url, '_blank'),
  }}
>
  <App />
</A2UIProvider>
```

---

### Technical Implementation Requirements

#### 1. Component Mapping (Core Task)

Create an **adapter for each A2UI component** that maps to shadcn/ui or Tailwind primitives. Each adapter must:

- Parse A2UI component props (from the v0.9 spec).
- Resolve data bindings (`{ "path": "/foo" }`) against the reactive data model.
- Map semantic props (`variant`, `tone`, `size`, `usageHint`) to shadcn variants and Tailwind classes.
- Handle `action` events (send action messages to the server).
- Support `checks` for validation.
- Render children recursively using the adjacency list model.

**Example Mapping (Button)**:

A2UI JSON:
```json
{
  "id": "submit_btn",
  "component": "Button",
  "text": "Submit",
  "variant": "primary",
  "size": "md",
  "disabled": { "path": "/form/isSubmitting" },
  "action": {
    "event": {
      "name": "submit_form",
      "context": {
        "email": { "path": "/form/email" }
      }
    }
  }
}
```

shadcn/ui equivalent:
```tsx
import { Button } from '@/components/ui/button';

<Button
  variant="default" // map "primary" → "default"
  size="md"
  disabled={dataModel['/form/isSubmitting']}
  onClick={() => {
    const context = { email: dataModel['/form/email'] };
    onAction({ name: 'submit_form', context, surfaceId, sourceComponentId: 'submit_btn', timestamp: new Date().toISOString() });
  }}
>
  Submit
</Button>
```

#### 2. Adjacency List Renderer

A2UI components come as a flat array with ID references. You must:
- Build a map of `id → component` for fast lookups.
- Recursively resolve `children` arrays (which are ID strings) into actual React elements.
- Handle missing components gracefully (render a fallback or warning).

#### 3. Data Model Store

Implement a **reactive data model** using Zustand or Valtio:
- Store the JSON state per surface (e.g., `{ '/user/name': 'John', '/form/email': 'john@example.com' }`).
- Support JSON Pointer paths (RFC 6901).
- Provide `get(path)`, `set(path, value)`, `subscribe(path, callback)`.
- Automatically notify components when bound paths change.

#### 4. Two-Way Binding for Inputs

Input components (`TextField`, `CheckBox`, etc.) must:
- Read their value from the bound path.
- Write changes immediately to the local data model (no server round-trip).
- Notify other components bound to the same path to re-render.

#### 5. Theming System

Map A2UI theme tokens to Tailwind CSS v4 variables:
- `theme.colors.primary` → CSS variable `--color-primary`
- `theme.typography.base.family` → `font-family`
- `theme.spacing.md` → Tailwind spacing utility

Provide a `<ThemeProvider>` that injects CSS variables or merges with shadcn's theme system.

#### 6. Validation Functions

Implement built-in `checks` functions:
- `required`: checks if a value is non-empty.
- `regex`: validates against a pattern.
- `minLength`, `maxLength`: string length checks.
- `min`, `max`: numeric range checks.

Allow users to register custom validation functions.

#### 7. Transport Adapters

Provide built-in adapters for:
- **WebSocket**: Bidirectional real-time streaming.
- **SSE (Server-Sent Events)**: Server→client streaming, with `fetch` for client→server actions.
- **Manual**: Users provide messages programmatically (useful for testing).

#### 8. RTL Layout Support

Support right-to-left (RTL) layouts per [SHADCN_RTL.md](./SHADCN_RTL.md):

- **Direction prop**: `A2UISurface` and `A2UIProvider` accept `dir` / `defaultDir` (`"ltr"` | `"rtl"`). Apply `dir` to the root surface container so content flows correctly.
- **shadcn RTL components**: Use shadcn components built with `rtl: true` in `components.json` so the CLI converts physical classes to logical equivalents:
  - `ml-*` / `mr-*` → `ms-*` / `me-*`
  - `pl-*` / `pr-*` → `ps-*` / `pe-*`
  - `text-left` / `text-right` → `text-start` / `text-end`
  - `left-*` / `right-*` → `start-*` / `end-*`
  - Directional icons use `rtl:rotate-180` where appropriate
  - Animations like `slide-in-from-left` → `slide-in-from-start`
- **Agent-driven direction**: Allow agents to set `dir` via `createSurface` config (e.g., `{ "dir": "rtl" }`) for locale-aware UIs.
- **Initialization**: New projects use `npx shadcn@latest init --rtl`; existing projects use `npx shadcn@latest migrate rtl`.

#### 9. TypeScript Types

Export full TypeScript definitions for:
- All A2UI message types (`CreateSurfaceMessage`, `UpdateComponentsMessage`, `UpdateDataModelMessage`, `ActionMessage`).
- All component schemas (props for each component type in the catalog).
- Data model paths and bindings.
- Theme tokens.

---

## App: Next.js 16 Documentation Site

### Goals
- **shadcn-based UI**: Built entirely on shadcn/ui components for navigation, layout, typography, forms, cards, and all interactive elements.
- **Introduce the package**: What is A2UI? What is `a2ui-shadcn`?
- **Installation guide**: For Next.js (App Router, Pages Router) and Vite.
- **RTL guide**: How to enable and use RTL layouts for Arabic, Hebrew, Persian, and other RTL languages.
- **Comprehensive API reference**: Document all components, hooks, and APIs.
- **Live examples**: Interactive demos showing A2UI JSON → rendered UI.
- **Theming guide**: How to customize colors, typography, spacing.
- **Custom components guide**: How to extend the catalog with your own components.
- **Transport guide**: How to connect to WebSocket, SSE, or custom transports.
- **GitHub link and NPM badge**: Make it easy to find the source and package.

### Tech Stack
- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **shadcn/ui** (base for the entire project: docs site, playground, and all application UI)
- **MDX** (for markdown documentation with embedded React components)
- **Syntax highlighting**: Use `shiki` or `prism-react-renderer` for code blocks.

### Site Structure

```
/                    → Homepage (hero, features, quick start)
/docs/introduction   → What is A2UI?
/docs/installation   → Installation in Next.js / Vite
/docs/usage          → Basic usage examples
/docs/components     → Full component reference (all 30+ A2UI components)
/docs/theming        → Theming and styling guide
/docs/rtl            → RTL layout guide (dir, logical classes, shadcn RTL setup)
/docs/custom         → Creating custom components
/docs/actions        → Handling user actions
/docs/transport      → Transport adapters (WebSocket, SSE, manual)
/docs/api            → API reference (hooks, providers, utilities)
/examples            → Interactive playground (live editor for A2UI JSON → rendered UI)
```

### Interactive Playground

Build a **live editor** page where users can:
- Paste A2UI JSON (e.g., `createSurface`, `updateComponents`, `updateDataModel` messages).
- See the rendered UI in real-time using `a2ui-shadcn`.
- Edit the JSON and see updates instantly.
- Use Monaco Editor or CodeMirror for the JSON editor.

---

## Deliverables Checklist

### Package (`a2ui-shadcn`)
- [ ] Full v0.9 component catalog mapped to shadcn/ui (all 30+ components).
- [ ] Reactive data model store with JSON Pointer support.
- [ ] Two-way binding for input components.
- [ ] Action handling (event and functionCall).
- [ ] Validation functions (required, regex, minLength, etc.).
- [ ] Theming system (map A2UI tokens to Tailwind v4 CSS variables).
- [ ] Transport adapters (WebSocket, SSE, manual).
- [ ] RTL layout support (dir prop, logical classes, agent-driven direction).
- [ ] Custom component registry API.
- [ ] TypeScript definitions for all APIs and message types.
- [ ] Unit tests (Vitest or Jest).
- [ ] README with quick start and examples.
- [ ] Published to NPM with semantic versioning.

### Documentation Site
- [ ] Homepage with hero, features, and quick start.
- [ ] Full installation guide (Next.js App Router, Pages Router, Vite).
- [ ] Component reference (all A2UI components with examples).
- [ ] Theming guide (how to customize colors, fonts, spacing).
- [ ] RTL guide (how to enable and use RTL layouts).
- [ ] Custom components guide.
- [ ] Transport guide (WebSocket, SSE, manual).
- [ ] API reference (all hooks, providers, utilities).
- [ ] Interactive playground (JSON editor → live rendered UI).
- [ ] Dark mode support.
- [ ] SEO optimized (meta tags, sitemap, robots.txt).
- [ ] Deployed to Vercel or Netlify.

### Monorepo Setup
- [ ] pnpm workspaces configured.
- [ ] Shared TypeScript config.
- [ ] Shared Tailwind config (v4).
- [ ] Turbo (optional) for build orchestration.
- [ ] ESLint and Prettier configured.
- [ ] GitHub Actions for CI/CD (lint, test, build).

---

## Development Guidelines

### Code Quality
- **TypeScript strict mode**: Enable `strict: true` in tsconfig.
- **ESLint**: Use `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`.
- **Prettier**: Consistent code formatting.
- **Naming conventions**: Use PascalCase for components, camelCase for functions/variables.

### Performance
- **Memoization**: Use `React.memo`, `useMemo`, `useCallback` to avoid unnecessary re-renders.
- **Virtual scrolling**: For `DataTable` and `List` components with large datasets, consider `@tanstack/react-virtual`.
- **Lazy loading**: Code-split heavy components (e.g., `Markdown`, `CodeBlock`).

### Accessibility
- Ensure all shadcn/ui components maintain ARIA attributes.
- Support keyboard navigation for all interactive components.
- Use semantic HTML (`<button>`, `<input>`, `<nav>`, etc.).

### Testing
- Unit tests for data model store (set, get, subscribe).
- Unit tests for component adapters (prop mapping, binding resolution).
- Integration tests for full A2UI message flows (createSurface → updateComponents → updateDataModel → action).

---

## Example User Workflow

1. **Install the package**:
   ```bash
   pnpm add a2ui-shadcn
   ```

2. **Set up shadcn/ui** (if not already):
   ```bash
   npx shadcn@latest init
   ```

3. **Use the renderer**:
   ```tsx
   import { A2UISurface } from 'a2ui-shadcn';

   export default function Page() {
     return (
       <A2UISurface
         surfaceId="dashboard"
         transport={{ type: 'websocket', url: 'wss://api.example.com/a2ui' }}
         onAction={(action) => console.log(action)}
       />
     );
   }
   ```

4. **Agent sends A2UI JSON**:
   ```json
   {"version":"v0.9","createSurface":{"surfaceId":"dashboard","catalog":["Text","Button","Column"]}}
   {"version":"v0.9","updateComponents":{"surfaceId":"dashboard","components":[{"id":"root","component":"Column","children":["title","btn"]},{"id":"title","component":"Text","text":"Welcome","usageHint":"h1"},{"id":"btn","component":"Button","text":"Click Me","action":{"event":{"name":"click"}}}]}}
   ```

5. **UI renders** with shadcn/ui styling, fully typed, and reactive.

---

## Additional Notes

- **Official A2UI Spec**: Reference https://a2ui.org/specification/v0.9-a2ui/ for canonical schemas.
- **shadcn/ui Docs**: https://ui.shadcn.com/docs for component APIs.
- **RTL Support**: Reference [SHADCN_RTL.md](./SHADCN_RTL.md) for shadcn RTL setup, `dir` usage, logical classes, and the `--rtl` / `migrate rtl` CLI options.
- **Tailwind CSS v4**: https://tailwindcss.com/docs for styling utilities.
- **Transport Examples**: Look at existing A2UI implementations (e.g., `@a2ui-bridge/react-shadcn`, `@xpert-ai/a2ui-react`) for inspiration, but build your own clean, well-documented version.

---

## Success Criteria

- Package is published to NPM and installable via `pnpm add a2ui-shadcn`.
- Docs site is live and fully navigable.
- All A2UI v0.9 components render correctly with shadcn/ui.
- RTL layouts work correctly for Arabic, Hebrew, Persian, and other RTL languages.
- Data binding and two-way binding work seamlessly.
- Theme customization is intuitive and well-documented.
- Developers can integrate the package into a Next.js or Vite project in under 5 minutes.
- Code is clean, well-typed, and maintainable.

---

## Final Instruction

Build this as if it were a **production-grade open-source project** ready for public release. Prioritize:
- **Developer experience**: Clear APIs, great docs, intuitive defaults.
- **Scalability**: Clean architecture that's easy to extend.
- **Reliability**: Comprehensive tests, error handling, edge case coverage.
- **Documentation**: Write docs as if you're teaching someone who has never heard of A2UI.
