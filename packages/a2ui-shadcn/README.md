# a2ui-shadcn

A production-grade npm package that maps the [A2UI (Agent-to-User-Interface)](https://a2ui.org) protocol v0.9 to shadcn/ui components. Build dynamic, agent-driven UIs with React and Tailwind CSS.

**[Documentation & Live Demo](https://a2ui-shadcn.shahnazar.me)**

## Installation

```bash
npm install a2ui-shadcn
# or
pnpm add a2ui-shadcn
# or
yarn add a2ui-shadcn
```

## Requirements

- React 18 or later
- shadcn/ui (or compatible Tailwind-based UI components)
- Tailwind CSS v4

## Quick Start

1. Set up shadcn/ui in your project (if not already):

```bash
npx shadcn@latest init
```

2. Import and use the renderer:

```tsx
import { A2UISurface } from 'a2ui-shadcn';

export default function App() {
  return (
    <A2UISurface
      surfaceId="my-surface"
      transport={{
        type: 'websocket',
        url: 'wss://your-agent-server.com/a2ui',
      }}
      onAction={(action) => {
        console.log('User action:', action);
      }}
    />
  );
}
```

## Usage Examples

### With Manual Transport (Testing)

Pass messages directly for testing or custom integrations:

```tsx
import { A2UISurface } from 'a2ui-shadcn';

const messages = [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'test',
      catalogId: 'default',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'test',
      components: [
        { id: 'root', component: 'Column', children: ['title', 'btn'] },
        { id: 'title', component: 'Text', text: 'Hello' },
        { id: 'btn', component: 'Button', text: 'Click', action: { event: { name: 'click' } } },
      ],
    },
  },
];

<A2UISurface surfaceId="test" messages={messages} onAction={(a) => console.log(a)} />
```

### With A2UIProvider (Global Config)

```tsx
import { A2UIProvider, A2UISurface } from 'a2ui-shadcn';

<A2UIProvider
  defaultTheme={{ primary: 'hsl(222.2 47.4% 11.2%)', radius: 'md' }}
  defaultDir="ltr"
  functions={{
    openUrl: ({ url }) => window.open(url, '_blank'),
    showAlert: ({ message }) => alert(message ?? ''),
  }}
  componentRegistry={{
    CustomChart: MyCustomChartComponent,
  }}
>
  <A2UISurface surfaceId="app" transport={{ type: 'websocket', url: 'wss://...' }} onAction={handleAction} />
</A2UIProvider>
```

### With useA2UIDataModel

Access or update the reactive data model from outside the renderer:

```tsx
import { A2UISurface, useA2UIDataModel } from 'a2ui-shadcn';

function MyStatus() {
  const [name, setName] = useA2UIDataModel<string>('/user/name');
  return <span>{name ?? 'Guest'}</span>;
}

// useA2UIDataModel must be used within A2UISurface tree
```

### Register Client-Side Functions

```tsx
import { registerFunction, registerContextFunction } from 'a2ui-shadcn';

registerFunction('openUrl', ({ url }) => {
  if (typeof url === 'string') window.open(url, '_blank');
});

registerContextFunction('formatDate', ({ value, format }) => {
  const date = value ? new Date(String(value)) : new Date();
  return date.toLocaleDateString(undefined, { dateStyle: 'medium' });
});
```

### Register Custom Validation

```tsx
import { registerCheck } from 'a2ui-shadcn';

registerCheck('customCheck', (args, resolveValue) => {
  const v = resolveValue(args.value);
  return v !== undefined && v !== null;
});
```

## API Reference

### Components

| Export | Description |
|--------|-------------|
| `A2UISurface` | Main component that consumes A2UI messages and renders the UI |
| `A2UIProvider` | Global configuration context (theme, dir, functions, componentRegistry) |

### Hooks

| Export | Description |
|--------|-------------|
| `useA2UIDataModel(path)` | Returns `[value, setValue]` for a JSON Pointer path. Must be used within `A2UISurface`. |
| `useA2UIConfig` | Returns the `A2UIProvider` value or `null` |

### Functions

| Export | Description |
|--------|-------------|
| `registerFunction(name, handler)` | Register a client-side function for `functionCall` actions |
| `registerContextFunction(name, handler)` | Register a function that returns a value for action context resolution (e.g. `formatDate`) |
| `registerCheck(name, fn)` | Register a custom validation function for component `checks` |

### Lower-Level APIs

| Export | Description |
|--------|-------------|
| `createDataModelStore(initial)` | Create a reactive data model store |
| `createTransport(config)` | Create a transport adapter (websocket, sse, manual) |

### Type Exports

`A2UIMessage`, `CreateSurfaceMessage`, `UpdateComponentsMessage`, `UpdateDataModelMessage`, `ActionMessage`, `A2UIComponent`, `A2UITheme`, `TransportConfig`, `ComponentRegistry`, `ComponentAdapterProps`, `DynamicValue`, `JsonPointer`

## A2UISurface Props

| Prop | Type | Description |
|------|------|-------------|
| `surfaceId` | `string` | Unique identifier for the surface |
| `transport` | `TransportConfig` | WebSocket, SSE, or omitted for manual |
| `messages` | `A2UIMessage[]` | Initial messages (required when no transport) |
| `onAction` | `(action) => void` | Callback when user triggers an action |
| `theme` | `A2UITheme` | Override theme tokens |
| `componentRegistry` | `ComponentRegistry` | Extend or override component mappings |
| `dir` | `'ltr' \| 'rtl'` | Layout direction |
| `className` | `string` | CSS class for root container |

## Transport Options

| Type | Config | Description |
|------|--------|-------------|
| `websocket` | `{ type: 'websocket', url: string }` | Bidirectional real-time streaming |
| `sse` | `{ type: 'sse', url: string, actionEndpoint?: string }` | Server-Sent Events; actions sent via separate endpoint |
| `manual` | `{ type: 'manual' }` | Provide messages via `messages` prop |

## Component Catalog

Over 30 A2UI components are supported:

**Layout:** Column, Row, Box, Card, Accordion, Tabs, Carousel

**Content:** Text, Image, Icon, Video, Audio, Markdown, CodeBlock, Divider

**Input:** TextField, CheckBox, Switch, Slider, ChoicePicker, DateTimeInput, FileUpload

**Interactive:** Button, Link, Menu

**Data:** DataTable, List

**Feedback:** ProgressIndicator, Badge, Snackbar

**Navigation:** AppBar, NavigationDrawer, BottomNavigation

## Built-in Validation

Built-in checks: `required`, `regex`, `minLength`, `maxLength`, `min`, `max`, `email`. Use `registerCheck` to add custom checks.

## Built-in Functions

- `openUrl` – opens a URL in a new tab
- `showAlert` – shows an alert dialog
- `formatDate` – formats a date for context resolution

## Features

- Full A2UI v0.9 compliance (`createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`)
- 30+ component adapters mapped to shadcn/ui primitives
- Reactive data model with JSON Pointer support
- Two-way binding for input components
- Transport adapters: WebSocket, SSE, Manual
- RTL layout support
- Custom component registry and theme overrides
- Action handling: `event` (server) and `functionCall` (client)
- `sendDataModel: true` – include full data model in every action
- Context resolution: path bindings and FunctionCall in action context

## Documentation

Visit **[https://a2ui-shadcn.shahnazar.me](https://a2ui-shadcn.shahnazar.me)** for:

- Complete API reference
- Interactive playground
- Usage guides and examples
- Theming documentation
- RTL setup guide
- Custom component creation

## License

MIT © [Reza Shahnazar](https://github.com/rezashahnazar)

## Links

- [Documentation](https://a2ui-shadcn.shahnazar.me)
- [GitHub Repository](https://github.com/rezashahnazar/a2ui-shadcn)
- [A2UI Protocol](https://a2ui.org)
- [shadcn/ui](https://ui.shadcn.com)
