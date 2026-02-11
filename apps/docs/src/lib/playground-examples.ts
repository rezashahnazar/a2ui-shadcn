export interface PlaygroundExample {
  id: string;
  name: string;
  description: string;
  category: string;
  json: string;
}

/** Unified JSON formatting: 2-space indent, no trailing newline */
export function formatPlaygroundJson(json: string): string {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return json;
  }
}

const fmt = formatPlaygroundJson;

export const playgroundExamples: PlaygroundExample[] = [
  {
    id: "welcome",
    name: "Welcome",
    description: "Simple welcome screen with title and button",
    category: "Basic",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard","sendDataModel":true}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","desc","name","btn"]},
    {"id":"title","component":"Text","text":"Welcome to A2UI","variant":"h2"},
    {"id":"desc","component":"Text","text":"Build agent-driven UIs with React and shadcn/ui","tone":"muted"},
    {"id":"name","component":"TextField","label":"Your Name","value":{"path":"/user/name"},"placeholder":"Enter your name"},
    {"id":"btn","component":"Button","text":"Get Started","variant":"primary","action":{"event":{"name":"get_started","context":{"name":{"path":"/user/name"}}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/user","value":{"name":"","visitCount":1}}}
]`),
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Contact form with validation-ready fields",
    category: "Forms",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard","sendDataModel":true}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","name","email","message","row"]},
    {"id":"title","component":"Text","text":"Contact Us","variant":"h2"},
    {"id":"name","component":"TextField","label":"Name","value":{"path":"/form/name"},"placeholder":"Your name"},
    {"id":"email","component":"TextField","label":"Email","value":{"path":"/form/email"},"placeholder":"you@example.com"},
    {"id":"message","component":"TextField","label":"Message","value":{"path":"/form/message"},"placeholder":"Your message...","multiline":true},
    {"id":"row","component":"Row","children":["submit","clear"]},
    {"id":"submit","component":"Button","text":"Send Message","variant":"primary","action":{"event":{"name":"submit_contact","context":{"name":{"path":"/form/name"},"email":{"path":"/form/email"},"message":{"path":"/form/message"}}}}},
    {"id":"clear","component":"Button","text":"Clear","variant":"ghost","action":{"event":{"name":"clear_form","context":{}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/form","value":{"name":"","email":"","message":"","submittedAt":null}}}
]`),
  },
  {
    id: "settings",
    name: "Settings",
    description: "User preferences with checkboxes",
    category: "Forms",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard","sendDataModel":true}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","desc","dark","notif","news","lang","save"]},
    {"id":"title","component":"Text","text":"Preferences","variant":"h2"},
    {"id":"desc","component":"Text","text":"Customize your experience. Changes are saved to data model.","tone":"muted","variant":"caption"},
    {"id":"dark","component":"CheckBox","label":"Dark mode","checked":{"path":"/prefs/darkMode"}},
    {"id":"notif","component":"CheckBox","label":"Email notifications","checked":{"path":"/prefs/notifications"}},
    {"id":"news","component":"CheckBox","label":"Marketing emails","checked":{"path":"/prefs/newsletter"}},
    {"id":"lang","component":"TextField","label":"Language","value":{"path":"/prefs/language"},"placeholder":"English"},
    {"id":"save","component":"Button","text":"Save Preferences","variant":"primary","action":{"event":{"name":"save_prefs","context":{"darkMode":{"path":"/prefs/darkMode"},"notifications":{"path":"/prefs/notifications"},"newsletter":{"path":"/prefs/newsletter"},"language":{"path":"/prefs/language"}}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/prefs","value":{"darkMode":true,"notifications":true,"newsletter":false,"language":"English","lastSaved":null}}}
]`),
  },
  {
    id: "sign-in",
    name: "Sign In",
    description: "Authentication form with email and password",
    category: "Forms",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","email","password","submit","forgot"]},
    {"id":"title","component":"Text","text":"Sign in to your account","variant":"h2"},
    {"id":"email","component":"TextField","label":"Email","value":{"path":"/auth/email"},"placeholder":"name@company.com"},
    {"id":"password","component":"TextField","label":"Password","value":{"path":"/auth/password"},"placeholder":"••••••••"},
    {"id":"submit","component":"Button","text":"Sign In","variant":"primary","action":{"event":{"name":"sign_in","context":{"email":{"path":"/auth/email"},"password":{"path":"/auth/password"}}}}},
    {"id":"forgot","component":"Button","text":"Forgot password?","variant":"ghost"}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/auth","value":{"email":"","password":""}}}
]`),
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Stats cards with quick actions",
    category: "Layout",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","cards"]},
    {"id":"title","component":"Text","text":"Overview","variant":"h2"},
    {"id":"cards","component":"Row","children":["c1","c2","c3"],"wrap":true},
    {"id":"c1","component":"Card","children":["c1-label","c1-value","c1-btn"]},
    {"id":"c1-label","component":"Text","text":"Total Users","tone":"muted"},
    {"id":"c1-value","component":"Text","text":"12,847","variant":"h3"},
    {"id":"c1-btn","component":"Button","text":"View","variant":"secondary","size":"sm"},
    {"id":"c2","component":"Card","children":["c2-label","c2-value","c2-btn"]},
    {"id":"c2-label","component":"Text","text":"Active Sessions","tone":"muted"},
    {"id":"c2-value","component":"Text","text":"1,234","variant":"h3"},
    {"id":"c2-btn","component":"Button","text":"View","variant":"secondary","size":"sm"},
    {"id":"c3","component":"Card","children":["c3-label","c3-value","c3-btn"]},
    {"id":"c3-label","component":"Text","text":"API Calls","tone":"muted"},
    {"id":"c3-value","component":"Text","text":"2.4M","variant":"h3"},
    {"id":"c3-btn","component":"Button","text":"View","variant":"secondary","size":"sm"}
  ]}}
]`),
  },
  {
    id: "project-cards",
    name: "Project Cards",
    description: "Feature cards with descriptions",
    category: "Layout",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","grid"]},
    {"id":"title","component":"Text","text":"Featured Projects","variant":"h2"},
    {"id":"grid","component":"Row","children":["card1","card2","card3"],"wrap":true},
    {"id":"card1","component":"Card","children":["t1","d1","b1"]},
    {"id":"t1","component":"Text","text":"Project Alpha","variant":"h3"},
    {"id":"d1","component":"Text","text":"AI-powered analytics platform","tone":"muted"},
    {"id":"b1","component":"Button","text":"Learn More","variant":"secondary"},
    {"id":"card2","component":"Card","children":["t2","d2","b2"]},
    {"id":"t2","component":"Text","text":"Project Beta","variant":"h3"},
    {"id":"d2","component":"Text","text":"Data visualization dashboard","tone":"muted"},
    {"id":"b2","component":"Button","text":"Learn More","variant":"secondary"},
    {"id":"card3","component":"Card","children":["t3","d3","b3"]},
    {"id":"t3","component":"Text","text":"Project Gamma","variant":"h3"},
    {"id":"d3","component":"Text","text":"Automation workflows","tone":"muted"},
    {"id":"b3","component":"Button","text":"Learn More","variant":"secondary"}
  ]}}
]`),
  },
  {
    id: "chat-ui",
    name: "Chat UI",
    description: "AI chat interface with input",
    category: "Real Use Cases",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["header","messages","input-row"]},
    {"id":"header","component":"Row","children":["title","badge"],"justify":"between"},
    {"id":"title","component":"Text","text":"AI Assistant","variant":"h3"},
    {"id":"badge","component":"Badge","text":"Online","variant":"secondary"},
    {"id":"messages","component":"Column","children":["msg1","msg2"]},
    {"id":"msg1","component":"Text","text":"Hi! How can I help you today?","tone":"muted"},
    {"id":"msg2","component":"Text","text":"Type your message below and press Send.","tone":"muted"},
    {"id":"input-row","component":"Row","children":["input","send"]},
    {"id":"input","component":"TextField","value":{"path":"/chat/input"},"placeholder":"Type a message..."},
    {"id":"send","component":"Button","text":"Send","variant":"primary","action":{"event":{"name":"send_message","context":{"text":{"path":"/chat/input"}}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/chat","value":{"input":""}}}
]`),
  },
  {
    id: "onboarding",
    name: "Onboarding",
    description: "Step-by-step setup flow",
    category: "Real Use Cases",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","step","name","next"]},
    {"id":"title","component":"Text","text":"Welcome! Let's get started","variant":"h2"},
    {"id":"step","component":"Row","children":["b1","b2","b3"]},
    {"id":"b1","component":"Badge","text":"1","variant":"default"},
    {"id":"b2","component":"Badge","text":"2","variant":"secondary"},
    {"id":"b3","component":"Badge","text":"3","variant":"secondary"},
    {"id":"name","component":"TextField","label":"Project name","value":{"path":"/onboarding/name"},"placeholder":"My awesome project"},
    {"id":"next","component":"Button","text":"Continue","variant":"primary","action":{"event":{"name":"next_step","context":{}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/onboarding","value":{"name":"","step":1}}}
]`),
  },
  {
    id: "api-setup",
    name: "API Setup",
    description: "API key configuration flow",
    category: "Real Use Cases",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","desc","key","save"]},
    {"id":"title","component":"Text","text":"Connect your API","variant":"h2"},
    {"id":"desc","component":"Text","text":"Enter your API key to enable integrations. Your key is stored securely.","tone":"muted"},
    {"id":"key","component":"TextField","label":"API Key","value":{"path":"/api/key"},"placeholder":"sk-..."},
    {"id":"save","component":"Button","text":"Save & Connect","variant":"primary","action":{"event":{"name":"save_api_key","context":{"key":{"path":"/api/key"}}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/api","value":{"key":""}}}
]`),
  },
  {
    id: "search-filter",
    name: "Search & Filter",
    description: "Search with filters UI",
    category: "Real Use Cases",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","search","filters","results"]},
    {"id":"title","component":"Text","text":"Search Documentation","variant":"h2"},
    {"id":"search","component":"TextField","value":{"path":"/search/query"},"placeholder":"Search... Ctrl+K"},
    {"id":"filters","component":"Row","children":["all","api","guides"]},
    {"id":"all","component":"Button","text":"All","variant":"secondary","size":"sm"},
    {"id":"api","component":"Button","text":"API","variant":"ghost","size":"sm"},
    {"id":"guides","component":"Button","text":"Guides","variant":"ghost","size":"sm"},
    {"id":"results","component":"Text","text":"Enter a search term to see results.","tone":"muted"}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/search","value":{"query":"","filter":"all"}}}
]`),
  },
  {
    id: "counter",
    name: "Counter",
    description: "Simple counter with increment/decrement",
    category: "Basic",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard","sendDataModel":true}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","display","row","reset"]},
    {"id":"title","component":"Text","text":"Counter Demo","variant":"h2"},
    {"id":"display","component":"Card","children":["count"]},
    {"id":"count","component":"Text","text":{"path":"/counter/value"},"variant":"h1"},
    {"id":"row","component":"Row","children":["dec","inc"]},
    {"id":"dec","component":"Button","text":"-","variant":"secondary","action":{"event":{"name":"decrement","context":{"current":{"path":"/counter/value"}}}}},
    {"id":"inc","component":"Button","text":"+","variant":"primary","action":{"event":{"name":"increment","context":{"current":{"path":"/counter/value"}}}}},
    {"id":"reset","component":"Button","text":"Reset","variant":"ghost","size":"sm","action":{"event":{"name":"reset_counter","context":{}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/counter","value":{"value":0,"lastAction":null}}}
]`),
  },
  {
    id: "data-binding",
    name: "Data Binding",
    description: "Live two-way binding demo",
    category: "Advanced",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard","sendDataModel":true}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","input","display","len"]},
    {"id":"title","component":"Text","text":"Live Data Binding","variant":"h2"},
    {"id":"input","component":"TextField","label":"Type something","value":{"path":"/userInput"},"placeholder":"Start typing..."},
    {"id":"display","component":"Text","text":{"path":"/userInput"},"variant":"body"},
    {"id":"len","component":"Text","text":"Character count visible in data model","tone":"muted","variant":"caption"}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/userInput","value":"Hello, A2UI!"}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/meta","value":{"charCount":12}}}
]`),
  },
  {
    id: "reactive-flow",
    name: "Reactive Flow Demo",
    description: "Actions + data binding: inputs update UI instantly; buttons send resolved context",
    category: "Advanced",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","row","display","btn"]},
    {"id":"title","component":"Text","text":"Actions & Reactive Behavior","variant":"h2"},
    {"id":"row","component":"Row","children":["field","label"]},
    {"id":"field","component":"TextField","label":"Name","value":{"path":"/form/name"},"placeholder":"Enter name"},
    {"id":"label","component":"Text","text":{"path":"/form/name"},"variant":"body","tone":"muted"},
    {"id":"display","component":"Text","text":"Text below updates as you type. Click Submit to send resolved context via onAction.","tone":"muted","variant":"caption"},
    {"id":"btn","component":"Button","text":"Submit","action":{"event":{"name":"submit_form","context":{"name":{"path":"/form/name"}}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/form","value":{"name":""}}}
]`),
  },
  {
    id: "send-datamodel",
    name: "sendDataModel",
    description: "Surface with sendDataModel: true - full data sent with every action",
    category: "Advanced",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard","sendDataModel":true}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","info","name","email","submit"]},
    {"id":"title","component":"Text","text":"sendDataModel Demo","variant":"h2"},
    {"id":"info","component":"Text","text":"With sendDataModel:true, the full data model is sent with every action. Check the Data Model tab!","variant":"caption","tone":"muted"},
    {"id":"name","component":"TextField","label":"Name","value":{"path":"/user/name"},"placeholder":"Your name"},
    {"id":"email","component":"TextField","label":"Email","value":{"path":"/user/email"},"placeholder":"you@example.com"},
    {"id":"submit","component":"Button","text":"Submit (check action log)","action":{"event":{"name":"submit","context":{"timestamp":{"path":"/timestamp"}}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/user","value":{"name":"","email":""}}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/timestamp","value":"2026-02-12T10:00:00Z"}}
]`),
  },
  {
    id: "context-functions",
    name: "Context Functions",
    description: "FunctionCall in action context (formatDate)",
    category: "Advanced",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","info","input","submit"]},
    {"id":"title","component":"Text","text":"Context Functions","variant":"h2"},
    {"id":"info","component":"Text","text":"The button's context includes a FunctionCall (formatDate) that is evaluated when clicked.","variant":"caption","tone":"muted"},
    {"id":"input","component":"TextField","label":"Your Message","value":{"path":"/message"},"placeholder":"Type something..."},
    {"id":"submit","component":"Button","text":"Submit with Timestamp","action":{"event":{"name":"submit_message","context":{"message":{"path":"/message"},"clientTime":{"call":"formatDate","args":{"value":"2026-02-12T10:30:00Z","format":"PPp"}}}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/message","value":"Hello from A2UI!"}}
]`),
  },
  {
    id: "nested-context",
    name: "Nested Context",
    description: "Complex nested context resolution with multiple paths",
    category: "Advanced",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","info","fname","lname","age","submit"]},
    {"id":"title","component":"Text","text":"Nested Context Resolution","variant":"h2"},
    {"id":"info","component":"Text","text":"Action context has nested objects with path bindings - all resolved when clicked.","variant":"caption","tone":"muted"},
    {"id":"fname","component":"TextField","label":"First Name","value":{"path":"/user/firstName"},"placeholder":"John"},
    {"id":"lname","component":"TextField","label":"Last Name","value":{"path":"/user/lastName"},"placeholder":"Doe"},
    {"id":"age","component":"TextField","label":"Age","value":{"path":"/user/age"},"placeholder":"25"},
    {"id":"submit","component":"Button","text":"Submit Nested Context","action":{"event":{"name":"submit_nested","context":{"user":{"firstName":{"path":"/user/firstName"},"lastName":{"path":"/user/lastName"},"age":{"path":"/user/age"}},"meta":{"source":"playground"}}}}}
  ]}},
  {"version":"v0.9","updateDataModel":{"surfaceId":"playground","path":"/user","value":{"firstName":"Alice","lastName":"Smith","age":"30"}}}
]`),
  },
  {
    id: "progress",
    name: "Progress",
    description: "Upload progress indicator",
    category: "Feedback",
    json: fmt(`[
  {"version":"v0.9","createSurface":{"surfaceId":"playground","catalogId":"standard"}},
  {"version":"v0.9","updateComponents":{"surfaceId":"playground","components":[
    {"id":"root","component":"Column","children":["title","progress","label","btn"]},
    {"id":"title","component":"Text","text":"Upload Progress","variant":"h2"},
    {"id":"progress","component":"ProgressIndicator","value":65,"max":100},
    {"id":"label","component":"Text","text":"Uploading file... 65%","tone":"muted"},
    {"id":"btn","component":"Button","text":"Cancel","variant":"secondary"}
  ]}}
]`),
  },
];

export function getExamplesByCategory() {
  const categories = new Set(playgroundExamples.map((ex) => ex.category));
  const grouped: Record<string, PlaygroundExample[]> = {};

  categories.forEach((category) => {
    grouped[category] = playgroundExamples.filter((ex) => ex.category === category);
  });

  return grouped;
}
