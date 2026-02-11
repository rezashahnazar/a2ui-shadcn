# a2ui-shadcn

A production-grade npm package that maps the [A2UI (Agent-to-User-Interface)](https://a2ui.org) protocol v0.9 to shadcn/ui components.

**[Documentation & Live Demo](https://a2ui-shadcn.shahnazar.me)**

## Installation

```bash
npm install a2ui-shadcn
# or
pnpm add a2ui-shadcn
# or
yarn add a2ui-shadcn
```

## Quick Start

```tsx
import { A2UISurface } from 'a2ui-shadcn';

export default function App() {
  return (
    <A2UISurface
      surfaceId="my-surface"
      transport={{ 
        type: 'websocket', 
        url: 'wss://your-agent-server.com/a2ui' 
      }}
      onAction={(action) => {
        console.log('User action:', action);
      }}
    />
  );
}
```

## Features

**Full A2UI v0.9 Compliance**
- `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`
- 30+ component types from the standard catalog

**shadcn/ui Integration**
- Maps A2UI components to beautiful shadcn/ui primitives
- Consistent design system with Tailwind CSS v4

**Reactive Data Binding**
- JSON Pointer support for data model paths
- Two-way binding for input components
- Zustand-powered reactive store

**RTL Support**
- Full right-to-left layout support
- Automatic direction detection
- Logical CSS properties

**Transport Adapters**
- WebSocket (bidirectional streaming)
- Server-Sent Events (server-to-client)
- Manual message ingestion

**Actions**
- `action.event`: context resolved at click (path bindings and FunctionCall, e.g. `formatDate`)
- `action.functionCall`: client-side functions via `registerFunction` (use `call`, not `name`)
- `sendDataModel: true` in createSurface: full data model included in every action sent to server
- Custom context functions via `registerContextFunction` (e.g. custom `formatDate`)

**Customization**
- Custom component registry
- Theme overrides
- Validation functions

## Documentation

Visit **[https://a2ui-shadcn.shahnazar.me](https://a2ui-shadcn.shahnazar.me)** for:

- 📖 Complete API reference
- 🎮 Interactive playground
- 📝 Usage guides and examples
- 🎨 Theming documentation
- 🌐 RTL setup guide

## License

MIT © [Reza Shahnazar](https://github.com/rezashahnazar)

## Links

- [Documentation](https://a2ui-shadcn.shahnazar.me)
- [GitHub Repository](https://github.com/rezashahnazar/a2ui-shadcn)
- [A2UI Protocol](https://a2ui.org)
- [shadcn/ui](https://ui.shadcn.com)
