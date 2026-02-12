export interface DocSection {
  title: string;
  description: string;
  content: string;
}

export const docsContent: Record<string, DocSection> = {
  introduction: {
    title: "Introduction",
    description: "Learn about the A2UI protocol and how a2ui-shadcn maps it to shadcn/ui components for building agent-driven UIs.",
    content: `## What is A2UI?

**A2UI (Agent-to-User-Interface)** is a JSON-based streaming protocol that enables AI agents and backend services to declaratively generate and update user interfaces. Instead of generating imperative code, agents emit structured JSON messages that client renderers interpret and display in real-time.

### Core Philosophy

A2UI separates concerns between:
- **Agent Logic**: What to display and when
- **UI Rendering**: How to display it beautifully
- **User Interaction**: How users engage with the interface

This separation enables:
- **Platform Independence**: Same JSON works across web, mobile, and desktop
- **Version Compatibility**: Renderers can be updated without changing agents
- **Design System Consistency**: Centralized styling and theming

### Key Concepts

**Declarative Syntax**
- Agents describe structure and data, not imperative code
- Components are defined with properties and relationships
- State changes are expressed as data updates

**Separation of Concerns**
- UI structure (\`updateComponents\`) is separate from application state (\`updateDataModel\`)
- Components reference data via JSON Pointer paths
- Business logic stays in the agent, presentation stays in the renderer

**Flat Adjacency List**
- Components are sent as a flat array with ID references for children
- Makes JSON generation simple and streaming-friendly
- LLMs can easily construct valid component structures

**Transport Agnostic**
- Works over WebSocket for bidirectional streaming
- Works over SSE (Server-Sent Events) for server-to-client updates
- Works with manual message ingestion for testing

### What is a2ui-shadcn?

**a2ui-shadcn** is a production-grade React renderer that maps A2UI protocol v0.9 to **shadcn/ui** components. It provides:

- **Full A2UI v0.9 Compliance**: All message types and 30+ components
- **shadcn/ui Integration**: Beautiful, accessible components out of the box
- **Reactive Data Binding**: Zustand-powered state management
- **Two-Way Binding**: Input components automatically sync with data model
- **RTL Support**: Full right-to-left layout for international apps
- **Theme Customization**: Override colors, typography, and spacing
- **TypeScript First**: Strongly typed APIs for safety and autocomplete
- **Framework Flexible**: Works with Next.js and Vite

### Architecture

\`\`\`diagram:architecture
\`\`\`

### Use Cases

**AI Chat Interfaces**
- Dynamic forms and data collection
- Rich media and interactive elements
- Streaming UI updates as agent processes

**Admin Dashboards**
- Agent-generated analytics views
- Custom data visualizations
- Dynamic filtering and sorting

**Workflow Automation**
- Multi-step forms and wizards
- Conditional UI based on agent logic
- Real-time status updates

**Customer Support**
- Interactive troubleshooting guides
- Dynamic help documentation
- Personalized UI per user context

### Protocol Messages

A2UI defines four core message types:

1. **\`createSurface\`** - Initialize a new UI surface with catalog and theme
2. **\`updateComponents\`** - Add or update UI components in flat adjacency list
3. **\`updateDataModel\`** - Update application state at JSON Pointer paths
4. **\`deleteSurface\`** - Remove a surface and clean up resources

> **Tip**: Messages are versioned (currently v0.9) for backward compatibility.

### Getting Started

Ready to build? Head to the [Installation](./installation) guide to set up a2ui-shadcn in your project.

For a hands-on introduction, try the [Interactive Playground](/playground) with live code examples.`,
  },
  installation: {
    title: "Installation",
    description: "Step-by-step guide to installing and setting up a2ui-shadcn in your Next.js or Vite project with shadcn/ui.",
    content: `## Installation Guide

### Prerequisites

Before installing a2ui-shadcn, ensure you have:

- **Node.js** 18.0.0 or higher
- **Package Manager**: pnpm (recommended), npm, or yarn
- **React** 18.0.0 or higher
- **TypeScript** 5.0.0 or higher (optional but recommended)

### Step 1: Install the Package

> **Note**: We recommend using pnpm for faster installs and better dependency management.

Choose your preferred package manager:

\`\`\`bash
# Using pnpm (recommended)
pnpm add a2ui-shadcn

# Using npm
npm install a2ui-shadcn

# Using yarn
yarn add a2ui-shadcn
\`\`\`

### Step 2: Set Up shadcn/ui

a2ui-shadcn requires shadcn/ui as a peer dependency. If you haven't already set it up:

\`\`\`bash
# Initialize shadcn/ui
npx shadcn@latest init
\`\`\`

Follow the prompts to configure:
- **Style**: Choose your preferred style (Default or New York)
- **Color**: Pick a base color (Slate, Gray, etc.)
- **CSS Variables**: Recommended for theming flexibility

**For RTL Support:**

If you need right-to-left layout support (Arabic, Hebrew, Persian):

\`\`\`bash
npx shadcn@latest init --rtl
\`\`\`

Or migrate an existing project:

\`\`\`bash
npx shadcn@latest migrate rtl
\`\`\`

### Step 3: Configure TypeScript (Optional)

Add path aliases to your \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
\`\`\`

### Step 4: Verify Installation

Create a simple test component:

\`\`\`tsx
import { A2UISurface } from 'a2ui-shadcn';

export default function TestPage() {
  const messages = [
    {
      version: "v0.9",
      createSurface: {
        surfaceId: "test",
        catalogId: "standard"
      }
    },
    {
      version: "v0.9",
      updateComponents: {
        surfaceId: "test",
        components: [
          {
            id: "root",
            component: "Text",
            text: "Hello, A2UI!"
          }
        ]
      }
    }
  ];

  return (
    <A2UISurface
      surfaceId="test"
      messages={messages}
    />
  );
}
\`\`\`

Run your development server and navigate to the test page. You should see "Hello, A2UI!" rendered.

### Framework-Specific Setup

#### Next.js 13+ (App Router)

a2ui-shadcn works seamlessly with Next.js App Router. No additional configuration needed.

**Example Page:**

\`\`\`tsx
// app/dashboard/page.tsx
import { A2UISurface } from 'a2ui-shadcn';

export default function DashboardPage() {
  return (
    <A2UISurface
      surfaceId="dashboard"
      transport={{
        type: 'websocket',
        url: process.env.NEXT_PUBLIC_A2UI_WS_URL
      }}
    />
  );
}
\`\`\`

#### Next.js Pages Router

Works with Pages Router as well. Import and use in any page component.

#### Vite + React

Add to your main component:

\`\`\`tsx
// src/App.tsx
import { A2UISurface } from 'a2ui-shadcn';

function App() {
  return (
    <A2UISurface
      surfaceId="app"
      transport={{ type: 'websocket', url: 'wss://api.example.com' }}
    />
  );
}

export default App;
\`\`\`

### Troubleshooting

**Issue: "Cannot find module 'a2ui-shadcn'"**
- Ensure the package is installed: \`pnpm list a2ui-shadcn\`
- Restart your dev server

**Issue: "Component not rendering"**
- Check browser console for errors
- Verify your A2UI JSON messages are valid
- Ensure \`surfaceId\` matches in all messages

**Issue: "Styling doesn't match"**
- Run \`npx shadcn@latest init\` to set up shadcn/ui
- Check Tailwind CSS is properly configured

### Next Steps

Now that you've installed a2ui-shadcn, continue to:
- [Usage Guide](./usage) - Learn basic API usage
- [Components Reference](./components) - Explore all available components
- [Interactive Playground](/playground) - Try live examples`,
  },
  usage: {
    title: "Usage",
    description: "Quick start guide and basic usage examples for rendering A2UI surfaces with the A2UISurface component.",
    content: `## Basic Usage

### The <A2UISurface> Component

The core of a2ui-shadcn is the \`<A2UISurface>\` component. It handles:
- Parsing A2UI JSON messages
- Managing component state and data model
- Rendering UI components
- Handling user interactions

### Minimal Example

\`\`\`tsx
import { A2UISurface } from 'a2ui-shadcn';

export default function MyApp() {
  return (
    <A2UISurface
      surfaceId="my-surface"
      transport={{
        type: 'websocket',
        url: 'wss://my-agent.example.com/a2ui'
      }}
      onAction={(action) => {
        console.log('User action:', action);
      }}
    />
  );
}
\`\`\`

### Manual Message Mode

For testing or server-side rendering, provide messages directly:

\`\`\`tsx
import { A2UISurface } from 'a2ui-shadcn';
import type { A2UIMessage } from 'a2ui-shadcn';

const messages: A2UIMessage[] = [
  {
    version: "v0.9",
    createSurface: {
      surfaceId: "demo",
      catalogId: "standard"
    }
  },
  {
    version: "v0.9",
    updateComponents: {
      surfaceId: "demo",
      components: [
        {
          id: "root",
          component: "Column",
          children: ["title", "button"]
        },
        {
          id: "title",
          component: "Text",
          text: "Welcome!",
          variant: "h1"
        },
        {
          id: "button",
          component: "Button",
          text: "Click Me",
          variant: "primary",
          action: {
            event: {
              name: "click",
              context: {}
            }
          }
        }
      ]
    }
  }
];

export default function Demo() {
  return (
    <A2UISurface
      surfaceId="demo"
      messages={messages}
      onAction={(action) => alert(\`Action: \${action.name}\`)}
    />
  );
}
\`\`\`

### WebSocket Transport

For real-time bidirectional communication:

\`\`\`tsx
<A2UISurface
  surfaceId="dashboard"
  transport={{
    type: 'websocket',
    url: 'wss://api.example.com/a2ui',
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onError: (error) => console.error('Error:', error)
  }}
  onAction={(action) => {
    // Actions are automatically sent back to agent via WebSocket
    console.log('Action sent:', action);
  }}
/>
\`\`\`

### Server-Sent Events (SSE)

For one-way streaming from server to client:

\`\`\`tsx
<A2UISurface
  surfaceId="notifications"
  transport={{
    type: 'sse',
    url: 'https://api.example.com/a2ui/stream',
    withCredentials: true
  }}
  onAction={(action) => {
    // Send actions back via HTTP POST
    fetch('https://api.example.com/a2ui/action', {
      method: 'POST',
      body: JSON.stringify(action),
      headers: { 'Content-Type': 'application/json' }
    });
  }}
/>
\`\`\`

### Handling Actions

Actions are triggered by user interactions (button clicks, form submissions, etc.):

\`\`\`tsx
<A2UISurface
  surfaceId="app"
  transport={{ type: 'websocket', url: 'wss://...' }}
  onAction={(action) => {
    console.log('Action name:', action.name);
    console.log('Context data:', action.context);
    console.log('Source component:', action.sourceComponentId);
    console.log('Timestamp:', action.timestamp);
    
    // Handle specific actions
    if (action.name === 'submit_form') {
      // Process form data from action.context
    }
  }}
/>
\`\`\`

### Custom Component Registry

Extend the catalog with your own components:

\`\`\`tsx
import { A2UISurface } from 'a2ui-shadcn';
import { MyCustomChart } from './MyCustomChart';

<A2UISurface
  surfaceId="app"
  componentRegistry={{
    CustomChart: MyCustomChart
  }}
  transport={{ type: 'websocket', url: 'wss://...' }}
/>
\`\`\`

Your custom component receives A2UI props:

\`\`\`tsx
interface CustomChartProps {
  data: Array<{ x: number; y: number }>;
  color?: string;
}

export function MyCustomChart({ data, color }: CustomChartProps) {
  return (
    <div>
      {/* Render your custom visualization */}
    </div>
  );
}
\`\`\`

### Theme Customization

Override default theme tokens:

\`\`\`tsx
<A2UISurface
  surfaceId="app"
  theme={{
    primary: 'hsl(222.2 47.4% 11.2%)',
    radius: 'lg',
    fontFamily: 'Inter, sans-serif'
  }}
  transport={{ type: 'websocket', url: 'wss://...' }}
/>
\`\`\`

### RTL Layout

Enable right-to-left layout:

\`\`\`tsx
<A2UISurface
  surfaceId="app"
  dir="rtl"
  transport={{ type: 'websocket', url: 'wss://...' }}
/>
\`\`\`

Agents can also control direction via \`createSurface\`:

\`\`\`json
{
  "version": "v0.9",
  "createSurface": {
    "surfaceId": "app",
    "catalogId": "standard",
    "dir": "rtl"
  }
}
\`\`\`

### Error Handling

Handle surface-level errors:

\`\`\`tsx
<A2UISurface
  surfaceId="app"
  transport={{ type: 'websocket', url: 'wss://...' }}
  onError={(error) => {
    console.error('Surface error:', error);
    // Show error UI to user
  }}
/>
\`\`\`

### Next Steps

- [Components Reference](./components) - Explore all available components
- [Theming Guide](./theming) - Customize colors and typography
- [API Reference](./api) - Complete TypeScript API docs`,
  },
  components: {
    title: "Components",
    description: "Complete reference of all 30+ A2UI components supported by a2ui-shadcn, including layout, input, and content components.",
    content: `## Component Catalog

a2ui-shadcn supports all 30+ components from the A2UI v0.9 standard catalog. Each component is fully documented with props, examples, and live previews.

### Browse by Category

Click on any component to view detailed documentation with interactive examples.

### Layout Components

Containers for organizing and structuring your UI:

- [**Column**](./components/column) - Vertical flex container that stacks children
- [**Row**](./components/row) - Horizontal flex container for side-by-side layouts
- [**Card**](./components/card) - Content card with border and padding

### Content Components

Components for displaying information:

- [**Text**](./components/text) - Typography with semantic variants (h1-h6, body, caption)

### Input Components

Form inputs for collecting user data:

- [**TextField**](./components/textfield) - Text input with validation support
- [**CheckBox**](./components/checkbox) - Boolean checkbox for selections

### Interactive Components

Components that respond to user interactions:

- [**Button**](./components/button) - Clickable button with multiple variants and actions

### Feedback Components

Components for status and notifications:

- [**Badge**](./components/badge) - Label for status, tags, and categories

### Reactive Behavior

Components support two reactive patterns:

- **Data binding**: Use \`{ "path": "/key" }\` for \`value\`, \`text\`, \`checked\`, etc. Inputs write to the data model on change; display components read from it. Updates are instant and local.
- **Actions**: Use \`action: { event: { name, context } }\` on buttons and links. Context can include path bindings that resolve to current values when the user clicks. See [Actions](./actions) for details.

\`\`\`diagram:action-reactive
\`\`\`

### Quick Example

Here's how to use components in A2UI JSON:

\`\`\`json
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "app",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["title", "button"]
      },
      {
        "id": "title",
        "component": "Text",
        "text": "Hello A2UI",
        "variant": "h2"
      },
      {
        "id": "button",
        "component": "Button",
        "text": "Click Me",
        "variant": "primary"
      }
    ]
  }
}
\`\`\`

### Next Steps

- Explore individual component pages for detailed props and examples
- Try components in the [Interactive Playground](/playground)
- Learn about [Theming](./theming) to customize component appearance`,
  },
  theming: {
    title: "Theming",
    description: "Customize colors, typography, and spacing in a2ui-shadcn using Tailwind CSS v4 and shadcn/ui theming.",
    content: `## Theming Guide

Customize the appearance of your A2UI surfaces.

### Override Theme Tokens

\`\`\`tsx
<A2UISurface
  surfaceId="app"
  theme={{
    primary: 'hsl(222.2 47.4% 11.2%)',
    secondary: 'hsl(210 40% 96.1%)',
    radius: 'md'
  }}
/>
\`\`\`

### Agent-Driven Themes

Agents can send theme tokens:

\`\`\`json
{
  "version": "v0.9",
  "createSurface": {
    "surfaceId": "app",
    "catalogId": "standard",
    "theme": {
      "colors": {
        "primary": "hsl(222.2 47.4% 11.2%)"
      }
    }
  }
}
\`\`\`

### CSS Variables

\`\`\`css
:root {
  --background: 0 0% 100%;
  --primary: 222.2 47.4% 11.2%;
}

.dark {
  --background: 222.2 84% 4.9%;
}
\`\`\`

### Custom Fonts

\`\`\`tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

<div className={inter.className}>
  <A2UISurface surfaceId="app" />
</div>
\`\`\``,
  },
  rtl: {
    title: "RTL Support",
    description: "Enable right-to-left (RTL) layouts for Arabic, Hebrew, Persian, and other RTL languages in a2ui-shadcn.",
    content: `## RTL Layout Support

Full right-to-left layout support for international applications.

### Enable RTL

\`\`\`tsx
<A2UISurface
  surfaceId="app"
  dir="rtl"
/>
\`\`\`

### Setup

Initialize shadcn/ui with RTL:

\`\`\`bash
npx shadcn@latest init --rtl
\`\`\`

Or migrate existing project:

\`\`\`bash
npx shadcn@latest migrate rtl
\`\`\`

### Agent-Controlled Direction

\`\`\`json
{
  "version": "v0.9",
  "createSurface": {
    "surfaceId": "app",
    "catalogId": "standard",
    "dir": "rtl"
  }
}
\`\`\`

### Dynamic Direction

\`\`\`tsx
const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

<A2UISurface surfaceId="app" dir={dir} />
\`\`\`

### Component Behavior

All components automatically adapt to RTL:
- Text alignment flips
- Layout direction reverses
- Icons mirror appropriately`,
  },
  custom: {
    title: "Custom Components",
    description: "Extend a2ui-shadcn by registering custom component types and overriding default component mappings.",
    content: `## Custom Components

Extend the catalog with your own components.

### Create Component

\`\`\`tsx
interface MyChartProps {
  data: Array<{ label: string; value: number }>;
}

export function MyChart({ data }: MyChartProps) {
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i}>
          <span>{item.label}</span>
          <div className="h-8 bg-primary" style={{ width: item.value + '%' }} />
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Register

\`\`\`tsx
<A2UISurface
  componentRegistry={{
    MyChart: MyChart
  }}
/>
\`\`\`

### Use in Messages

\`\`\`json
{
  "id": "chart1",
  "component": "MyChart",
  "data": [
    { "label": "Sales", "value": 75 }
  ]
}
\`\`\`

### Data Binding

\`\`\`tsx
import { useA2UIDataModel } from 'a2ui-shadcn';

export function LiveCounter() {
  const [count] = useA2UIDataModel('/counter');
  return <div>{count}</div>;
}
\`\`\``,
  },
  actions: {
    title: "Actions",
    description: "Handle user interactions with A2UI action messages, including button clicks, form submissions, and reactive data binding.",
    content: `## Handling Actions

Process user interactions with action handlers.

### Actions & Reactive Behavior

a2ui-shadcn provides two reactive flows: **two-way data binding** for inputs and **event actions** for buttons and links.

\`\`\`diagram:action-reactive
\`\`\`

\`\`\`demo:interactive-action
\`\`\`

**Two-Way Binding**: Input components (\`TextField\`, \`CheckBox\`, \`Switch\`, \`Slider\`, \`ChoicePicker\`) use \`value\` or \`checked\` with \`{ "path": "/key" }\`. When the user types or toggles, \`dataModel.set(path, value)\` runs immediately. The store notifies subscribers, and any component bound to that path (e.g. \`Text\` with \`text: { "path": "/key" }\`) re-renders with the new value. No server round-trip is needed for live updates.

**User Actions**: Buttons and links with \`action: { event: { name, context } }\` resolve \`context\` path bindings to current values at click time, then call \`onAction\` with the resolved data. When using transports (WebSocket, SSE), actions are sent to the agent. The agent can respond with \`updateDataModel\` or \`updateComponents\` to update the UI.

### Action Structure

\`\`\`typescript
interface ActionMessage {
  version: "v0.9";
  action: {
    surfaceId: string;
    sourceComponentId: string;
    name: string;
    context: Record<string, any>;
    timestamp: string;
  };
}
\`\`\`

### Basic Handler

\`\`\`tsx
<A2UISurface
  onAction={(action) => {
    console.log('Action:', action.name);
    console.log('Data:', action.context);
  }}
/>
\`\`\`

### Form Actions

\`\`\`json
{
  "id": "submit",
  "component": "Button",
  "text": "Submit",
  "action": {
    "event": {
      "name": "submit_form",
      "context": {
        "email": { "path": "/form/email" },
        "name": { "path": "/form/name" }
      }
    }
  }
}
\`\`\`

Handler:

\`\`\`tsx
onAction={(action) => {
  if (action.name === 'submit_form') {
    const { email, name } = action.context;
    fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ email, name })
    });
  }
}}
\`\`\`

### Context Resolution

When a button is clicked, **all context values are resolved** before calling \`onAction\`. Resolution happens **recursively**:

**Path Bindings**: \`{ "path": "/user/email" }\` - current value from data model  
**Nested Objects**: Entire object structure is resolved recursively  
**FunctionCall**: \`{ "call": "formatDate", "args": {...} }\` - function executed, return value used

\`\`\`json
{
  "action": {
    "event": {
      "name": "submit",
      "context": {
        "user": {
          "email": { "path": "/form/email" },
          "name": { "path": "/form/name" }
        },
        "timestamp": {
          "call": "formatDate",
          "args": { "value": "2026-02-12T10:00:00Z" }
        },
        "meta": { "source": "web" }
      }
    }
  }
}
\`\`\`

**Resolved context** sent to \`onAction\`:

\`\`\`json
{
  "user": { "email": "alice@example.com", "name": "Alice" },
  "timestamp": "2/12/2026, 10:00 AM",
  "meta": { "source": "web" }
}
\`\`\`

### sendDataModel

Enable \`sendDataModel: true\` in \`createSurface\` to **automatically include the full data model** with every action:

\`\`\`json
{
  "version": "v0.9",
  "createSurface": {
    "surfaceId": "main",
    "catalogId": "standard",
    "sendDataModel": true
  }
}
\`\`\`

**Action payload** will include \`dataModel\`:

\`\`\`typescript
onAction={(action) => {
  console.log(action.name);      // "submit"
  console.log(action.context);   // { email: "...", name: "..." }
  console.log(action.dataModel); // { form: { email: "...", name: "..." }, prefs: {...} }
}}
\`\`\`

This is useful when the agent needs the **full UI state** alongside the user's action.

### Context Functions

Register functions that **return values** for use in action context:

\`\`\`tsx
import { registerContextFunction } from 'a2ui-shadcn';

registerContextFunction('formatDate', ({ value, format }) => {
  const date = new Date(String(value));
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
});

registerContextFunction('getUserAgent', () => navigator.userAgent);
\`\`\`

Agent uses in button context:

\`\`\`json
{
  "action": {
    "event": {
      "name": "submit",
      "context": {
        "timestamp": { "call": "formatDate", "args": { "value": "2026-02-12T10:00:00Z" } },
        "browser": { "call": "getUserAgent" }
      }
    }
  }
}
\`\`\`

### Client-Side Action Functions

For local actions (no server round-trip), use \`action.functionCall\`:

\`\`\`tsx
import { registerFunction } from 'a2ui-shadcn';

registerFunction('openUrl', ({ url }) => {
  window.open(String(url), '_blank');
});
\`\`\`

Agent triggers:

\`\`\`json
{
  "action": {
    "functionCall": {
      "call": "openUrl",
      "args": { "url": "https://example.com" }
    }
  }
}
\`\`\`

**Note**: Use \`"call"\` not \`"name"\` for functionCall (A2UI v0.9 spec).

### Live Examples

Try these in the [Playground](/playground):

- **Two-Way Binding**: See \`TextField\` update \`Text\` in real-time
- **Reactive Flow Demo**: Type and click "Submit" to see context resolution
- **sendDataModel**: Enable in \`createSurface\`, check action log's "dataModel" field
- **Context Functions**: See \`formatDate\` resolve timestamp when button clicked
- **Nested Context**: Complex nested objects with path bindings`,
  },
  transport: {
    title: "Transport",
    description: "Configure WebSocket, Server-Sent Events (SSE), or manual message transports for A2UI communication.",
    content: `## Transport Adapters

Configure how agents communicate with your UI.

### WebSocket

Bidirectional streaming:

\`\`\`tsx
<A2UISurface
  transport={{
    type: 'websocket',
    url: 'wss://agent.example.com/a2ui',
    onConnect: () => console.log('Connected'),
    reconnect: true
  }}
/>
\`\`\`

### Server-Sent Events

Server-to-client streaming:

\`\`\`tsx
<A2UISurface
  transport={{
    type: 'sse',
    url: 'https://agent.example.com/stream'
  }}
  onAction={async (action) => {
    await fetch('/api/action', {
      method: 'POST',
      body: JSON.stringify(action)
    });
  }}
/>
\`\`\`

### Manual Messages

For testing:

\`\`\`tsx
const messages = [
  { version: 'v0.9', createSurface: { surfaceId: 'app' } }
];

<A2UISurface messages={messages} />
\`\`\`

### Authentication

\`\`\`tsx
<A2UISurface
  transport={{
    type: 'websocket',
    url: \`wss://api.example.com?token=\${authToken}\`
  }}
/>
\`\`\``,
  },
  api: {
    title: "API Reference",
    description: "Complete TypeScript API documentation for a2ui-shadcn components, hooks, types, and utilities.",
    content: `## API Reference

Complete TypeScript API for a2ui-shadcn.

### \`<A2UISurface>\`

**Props:**

\`\`\`typescript
interface A2UISurfaceProps {
  surfaceId: string;
  messages?: A2UIMessage[];
  transport?: TransportConfig;
  onAction?: (action: ActionMessage) => void;
  onError?: (error: Error) => void;
  theme?: Partial<ThemeTokens>;
  componentRegistry?: ComponentRegistry;
  dir?: 'ltr' | 'rtl';
  className?: string;
}
\`\`\`

### \`useA2UIDataModel\`

\`\`\`typescript
function useA2UIDataModel<T>(
  path: string
): [T | undefined, (value: T) => void];
\`\`\`

**Example:**

\`\`\`tsx
const [name, setName] = useA2UIDataModel<string>('/user/name');
\`\`\`

### \`registerFunction\`

\`\`\`typescript
function registerFunction(
  name: string,
  handler: (args: any) => void
): void;
\`\`\`

### Message Types

**A2UIMessage:**

\`\`\`typescript
type A2UIMessage =
  | CreateSurfaceMessage
  | UpdateComponentsMessage
  | UpdateDataModelMessage
  | DeleteSurfaceMessage;
\`\`\`

**CreateSurfaceMessage:**

\`\`\`typescript
interface CreateSurfaceMessage {
  version: 'v0.9';
  createSurface: {
    surfaceId: string;
    catalogId: string;
    theme?: ThemeTokens;
    dir?: 'ltr' | 'rtl';
  };
}
\`\`\`

**UpdateComponentsMessage:**

\`\`\`typescript
interface UpdateComponentsMessage {
  version: 'v0.9';
  updateComponents: {
    surfaceId: string;
    components: A2UIComponent[];
  };
}
\`\`\`

**UpdateDataModelMessage:**

\`\`\`typescript
interface UpdateDataModelMessage {
  version: 'v0.9';
  updateDataModel: {
    surfaceId: string;
    path: string;
    value: any;
  };
}
\`\`\`

**ActionMessage:**

\`\`\`typescript
interface ActionMessage {
  version: 'v0.9';
  action: {
    surfaceId: string;
    sourceComponentId: string;
    name: string;
    context: Record<string, any>;
    timestamp: string;
  };
}
\`\`\`

### Transport Types

\`\`\`typescript
interface WebSocketTransport {
  type: 'websocket';
  url: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnect?: boolean;
}

interface SSETransport {
  type: 'sse';
  url: string;
  headers?: Record<string, string>;
}
\`\`\`

### Next Steps

- [Interactive Playground](/playground) - Try the API live`,
  },
};
