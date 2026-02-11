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

export const componentDocs: Record<string, ComponentDoc> = {
  // Layout Components
  column: {
    name: "Column",
    category: "Layout",
    description: "A vertical flex container that stacks children from top to bottom. Supports spacing, alignment, and responsive design.",
    props: [
      { name: "id", type: "string", required: true, description: "Unique identifier for the component" },
      { name: "children", type: "string[]", required: false, description: "Array of child component IDs" },
      { name: "gap", type: "string", required: false, description: "Spacing between children", default: "md" },
      { name: "align", type: "'start' | 'center' | 'end'", required: false, description: "Horizontal alignment", default: "start" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Basic Column",
        description: "A simple vertical layout with text elements",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "gap": "md",
          "children": ["title", "subtitle", "body"]
        },
        {
          "id": "title",
          "component": "Text",
          "text": "Welcome to A2UI",
          "variant": "h2"
        },
        {
          "id": "subtitle",
          "component": "Text",
          "text": "Build agent-driven interfaces",
          "tone": "muted"
        },
        {
          "id": "body",
          "component": "Text",
          "text": "Column components stack children vertically with customizable spacing and alignment."
        }
      ]
    }
  }
]`,
      },
      {
        title: "Column with Cards",
        description: "Using columns to organize card layouts",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "gap": "lg",
          "children": ["card1", "card2"]
        },
        {
          "id": "card1",
          "component": "Card",
          "children": ["card1-title", "card1-text"]
        },
        {
          "id": "card1-title",
          "component": "Text",
          "text": "First Card",
          "variant": "h3"
        },
        {
          "id": "card1-text",
          "component": "Text",
          "text": "This is the first card in the column"
        },
        {
          "id": "card2",
          "component": "Card",
          "children": ["card2-title", "card2-text"]
        },
        {
          "id": "card2-title",
          "component": "Text",
          "text": "Second Card",
          "variant": "h3"
        },
        {
          "id": "card2-text",
          "component": "Text",
          "text": "This is the second card in the column"
        }
      ]
    }
  }
]`,
      },
    ],
  },
  row: {
    name: "Row",
    category: "Layout",
    description: "A horizontal flex container that arranges children from left to right (or right to left in RTL mode). Supports wrapping, justification, and responsive design.",
    props: [
      { name: "id", type: "string", required: true, description: "Unique identifier for the component" },
      { name: "children", type: "string[]", required: false, description: "Array of child component IDs" },
      { name: "gap", type: "string", required: false, description: "Spacing between children", default: "md" },
      { name: "justify", type: "'start' | 'center' | 'end' | 'between'", required: false, description: "Horizontal distribution", default: "start" },
      { name: "wrap", type: "boolean", required: false, description: "Allow items to wrap to next line", default: "false" },
    ],
    examples: [
      {
        title: "Basic Row",
        description: "A simple horizontal layout with buttons",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Row",
          "gap": "md",
          "justify": "start",
          "children": ["btn1", "btn2", "btn3"]
        },
        {
          "id": "btn1",
          "component": "Button",
          "text": "Action",
          "variant": "primary"
        },
        {
          "id": "btn2",
          "component": "Button",
          "text": "Cancel",
          "variant": "secondary"
        },
        {
          "id": "btn3",
          "component": "Button",
          "text": "Delete",
          "variant": "destructive"
        }
      ]
    }
  }
]`,
      },
      {
        title: "Centered Row",
        description: "Row with centered content and badges",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Row",
          "gap": "sm",
          "justify": "center",
          "children": ["badge1", "badge2", "badge3"]
        },
        {
          "id": "badge1",
          "component": "Badge",
          "text": "React"
        },
        {
          "id": "badge2",
          "component": "Badge",
          "text": "TypeScript"
        },
        {
          "id": "badge3",
          "component": "Badge",
          "text": "Tailwind"
        }
      ]
    }
  }
]`,
      },
    ],
  },
  button: {
    name: "Button",
    category: "Interactive",
    description: "A clickable button component with multiple variants, sizes, and support for actions and loading states.",
    props: [
      { name: "id", type: "string", required: true, description: "Unique identifier for the component" },
      { name: "text", type: "string", required: true, description: "Button label text" },
      { name: "variant", type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'", required: false, description: "Visual style variant", default: "primary" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, description: "Button size", default: "md" },
      { name: "disabled", type: "boolean | { path: string }", required: false, description: "Disable the button" },
      { name: "action", type: "Action", required: false, description: "Action to trigger on click" },
    ],
    examples: [
      {
        title: "Button Variants",
        description: "Different button styles for various use cases",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "gap": "md",
          "children": ["primary", "secondary", "outline", "ghost", "destructive"]
        },
        {
          "id": "primary",
          "component": "Button",
          "text": "Primary Button",
          "variant": "primary"
        },
        {
          "id": "secondary",
          "component": "Button",
          "text": "Secondary Button",
          "variant": "secondary"
        },
        {
          "id": "outline",
          "component": "Button",
          "text": "Outline Button",
          "variant": "outline"
        },
        {
          "id": "ghost",
          "component": "Button",
          "text": "Ghost Button",
          "variant": "ghost"
        },
        {
          "id": "destructive",
          "component": "Button",
          "text": "Destructive Button",
          "variant": "destructive"
        }
      ]
    }
  }
]`,
      },
      {
        title: "Interactive Button",
        description: "Button with action that triggers an event",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "gap": "md",
          "children": ["label", "button"]
        },
        {
          "id": "label",
          "component": "Text",
          "text": "Click the button below to trigger an action",
          "tone": "muted"
        },
        {
          "id": "button",
          "component": "Button",
          "text": "Click Me!",
          "variant": "primary",
          "action": {
            "event": {
              "name": "button_clicked",
              "context": {
                "message": "Hello from A2UI!"
              }
            }
          }
        }
      ]
    }
  }
]`,
      },
    ],
  },
  text: {
    name: "Text",
    category: "Content",
    description: "A typography component for displaying text with various semantic variants (headings, body text, captions) and tones.",
    props: [
      { name: "id", type: "string", required: true, description: "Unique identifier for the component" },
      { name: "text", type: "string | { path: string }", required: true, description: "Text content or data binding" },
      { name: "variant", type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption'", required: false, description: "Typography style", default: "body" },
      { name: "tone", type: "'default' | 'muted' | 'accent'", required: false, description: "Text color tone", default: "default" },
      { name: "align", type: "'start' | 'center' | 'end'", required: false, description: "Text alignment" },
    ],
    examples: [
      {
        title: "Typography Hierarchy",
        description: "Different text variants for content structure",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "gap": "sm",
          "children": ["h1", "h2", "h3", "body", "caption"]
        },
        {
          "id": "h1",
          "component": "Text",
          "text": "Heading 1",
          "variant": "h1"
        },
        {
          "id": "h2",
          "component": "Text",
          "text": "Heading 2",
          "variant": "h2"
        },
        {
          "id": "h3",
          "component": "Text",
          "text": "Heading 3",
          "variant": "h3"
        },
        {
          "id": "body",
          "component": "Text",
          "text": "Body text for regular content",
          "variant": "body"
        },
        {
          "id": "caption",
          "component": "Text",
          "text": "Caption text for secondary information",
          "variant": "caption",
          "tone": "muted"
        }
      ]
    }
  }
]`,
      },
      {
        title: "Data Binding",
        description: "Text component with live data binding",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "children": ["label", "display"]
        },
        {
          "id": "label",
          "component": "Text",
          "text": "Dynamic Content:",
          "tone": "muted"
        },
        {
          "id": "display",
          "component": "Text",
          "text": {
            "path": "/message"
          },
          "variant": "h3"
        }
      ]
    }
  },
  {
    "version": "v0.9",
    "updateDataModel": {
      "surfaceId": "demo",
      "path": "/message",
      "value": "Hello from Data Model!"
    }
  }
]`,
      },
    ],
  },
  textfield: {
    name: "TextField",
    category: "Input",
    description: "A text input component with support for single-line or multiline text, validation, placeholders, and data binding.",
    props: [
      { name: "id", type: "string", required: true, description: "Unique identifier for the component" },
      { name: "label", type: "string", required: false, description: "Label text above the input" },
      { name: "value", type: "string | { path: string }", required: false, description: "Input value or data binding" },
      { name: "placeholder", type: "string", required: false, description: "Placeholder text" },
      { name: "multiline", type: "boolean", required: false, description: "Enable multiline textarea", default: "false" },
      { name: "disabled", type: "boolean", required: false, description: "Disable the input" },
    ],
    examples: [
      {
        title: "Basic Text Input",
        description: "Simple text field with label and placeholder",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "children": ["field"]
        },
        {
          "id": "field",
          "component": "TextField",
          "label": "Name",
          "placeholder": "Enter your name",
          "value": {
            "path": "/name"
          }
        }
      ]
    }
  },
  {
    "version": "v0.9",
    "updateDataModel": {
      "surfaceId": "demo",
      "path": "/name",
      "value": ""
    }
  }
]`,
      },
      {
        title: "Multiline Textarea",
        description: "Text area for longer content",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "TextField",
          "label": "Message",
          "placeholder": "Type your message here...",
          "multiline": true,
          "value": {
            "path": "/message"
          }
        }
      ]
    }
  },
  {
    "version": "v0.9",
    "updateDataModel": {
      "surfaceId": "demo",
      "path": "/message",
      "value": ""
    }
  }
]`,
      },
    ],
  },
  card: {
    name: "Card",
    category: "Layout",
    description: "A container component that groups related content with a border, optional shadow, and background. Perfect for organizing information into distinct sections.",
    props: [
      { name: "id", type: "string", required: true, description: "Unique identifier for the component" },
      { name: "children", type: "string[]", required: false, description: "Array of child component IDs" },
      { name: "className", type: "string", required: false, description: "Additional CSS classes" },
    ],
    examples: [
      {
        title: "Simple Card",
        description: "A basic card with text content",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Card",
          "children": ["title", "description"]
        },
        {
          "id": "title",
          "component": "Text",
          "text": "Card Title",
          "variant": "h3"
        },
        {
          "id": "description",
          "component": "Text",
          "text": "This is a card component that groups related content together with proper spacing and styling.",
          "tone": "muted"
        }
      ]
    }
  }
]`,
      },
      {
        title: "Card with Action",
        description: "Card with button for user interaction",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Card",
          "children": ["title", "description", "button"]
        },
        {
          "id": "title",
          "component": "Text",
          "text": "Get Started",
          "variant": "h3"
        },
        {
          "id": "description",
          "component": "Text",
          "text": "Learn how to build agent-driven UIs with A2UI",
          "tone": "muted"
        },
        {
          "id": "button",
          "component": "Button",
          "text": "View Docs",
          "variant": "primary"
        }
      ]
    }
  }
]`,
      },
    ],
  },
  badge: {
    name: "Badge",
    category: "Feedback",
    description: "A small label component for displaying status, categories, or tags. Perfect for highlighting information or categorizing content.",
    props: [
      { name: "id", type: "string", required: true, description: "Unique identifier for the component" },
      { name: "text", type: "string", required: true, description: "Badge text content" },
      { name: "variant", type: "'default' | 'secondary' | 'outline' | 'destructive'", required: false, description: "Visual style", default: "default" },
    ],
    examples: [
      {
        title: "Badge Variants",
        description: "Different badge styles",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Row",
          "gap": "sm",
          "wrap": true,
          "children": ["default", "secondary", "outline", "destructive"]
        },
        {
          "id": "default",
          "component": "Badge",
          "text": "Default",
          "variant": "default"
        },
        {
          "id": "secondary",
          "component": "Badge",
          "text": "Secondary",
          "variant": "secondary"
        },
        {
          "id": "outline",
          "component": "Badge",
          "text": "Outline",
          "variant": "outline"
        },
        {
          "id": "destructive",
          "component": "Badge",
          "text": "Destructive",
          "variant": "destructive"
        }
      ]
    }
  }
]`,
      },
      {
        title: "Status Badges",
        description: "Using badges to show status",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "gap": "md",
          "children": ["row1", "row2", "row3"]
        },
        {
          "id": "row1",
          "component": "Row",
          "gap": "md",
          "children": ["label1", "badge1"]
        },
        {
          "id": "label1",
          "component": "Text",
          "text": "Status:"
        },
        {
          "id": "badge1",
          "component": "Badge",
          "text": "Active"
        },
        {
          "id": "row2",
          "component": "Row",
          "gap": "md",
          "children": ["label2", "badge2"]
        },
        {
          "id": "label2",
          "component": "Text",
          "text": "Version:"
        },
        {
          "id": "badge2",
          "component": "Badge",
          "text": "v2.1.0",
          "variant": "secondary"
        },
        {
          "id": "row3",
          "component": "Row",
          "gap": "md",
          "children": ["label3", "badge3"]
        },
        {
          "id": "label3",
          "component": "Text",
          "text": "Environment:"
        },
        {
          "id": "badge3",
          "component": "Badge",
          "text": "Production",
          "variant": "outline"
        }
      ]
    }
  }
]`,
      },
    ],
  },
  checkbox: {
    name: "CheckBox",
    category: "Input",
    description: "A checkbox input for boolean selection with support for checked, unchecked, and indeterminate states.",
    props: [
      { name: "id", type: "string", required: true, description: "Unique identifier for the component" },
      { name: "label", type: "string", required: false, description: "Label text next to checkbox" },
      { name: "checked", type: "boolean | { path: string }", required: false, description: "Checked state or data binding" },
      { name: "disabled", type: "boolean", required: false, description: "Disable the checkbox" },
    ],
    examples: [
      {
        title: "Basic Checkbox",
        description: "Simple checkbox with label",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "CheckBox",
          "label": "Accept terms and conditions",
          "checked": {
            "path": "/accepted"
          }
        }
      ]
    }
  },
  {
    "version": "v0.9",
    "updateDataModel": {
      "surfaceId": "demo",
      "path": "/accepted",
      "value": false
    }
  }
]`,
      },
      {
        title: "Checkbox List",
        description: "Multiple checkboxes for selections",
        json: `[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "demo",
      "catalogId": "standard"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "demo",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "gap": "sm",
          "children": ["title", "cb1", "cb2", "cb3"]
        },
        {
          "id": "title",
          "component": "Text",
          "text": "Select features:",
          "variant": "h4"
        },
        {
          "id": "cb1",
          "component": "CheckBox",
          "label": "Dark mode",
          "checked": {
            "path": "/features/darkMode"
          }
        },
        {
          "id": "cb2",
          "component": "CheckBox",
          "label": "Notifications",
          "checked": {
            "path": "/features/notifications"
          }
        },
        {
          "id": "cb3",
          "component": "CheckBox",
          "label": "Analytics",
          "checked": {
            "path": "/features/analytics"
          }
        }
      ]
    }
  },
  {
    "version": "v0.9",
    "updateDataModel": {
      "surfaceId": "demo",
      "path": "/features",
      "value": {
        "darkMode": true,
        "notifications": false,
        "analytics": false
      }
    }
  }
]`,
      },
    ],
  },
};

export const componentCategories = {
  layout: ["column", "row", "card"],
  content: ["text"],
  input: ["textfield", "checkbox"],
  interactive: ["button"],
  feedback: ["badge"],
};

export function getAllComponentSlugs(): string[] {
  return Object.keys(componentDocs);
}

export function getComponentsByCategory() {
  const categories: Record<string, Array<{ slug: string; name: string }>> = {
    Layout: [],
    Content: [],
    Input: [],
    Interactive: [],
    Feedback: [],
  };

  Object.entries(componentDocs).forEach(([slug, doc]) => {
    if (categories[doc.category]) {
      categories[doc.category].push({ slug, name: doc.name });
    }
  });

  return categories;
}
