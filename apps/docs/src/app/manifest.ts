import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'a2ui-shadcn - A2UI Protocol Renderer for shadcn/ui',
    short_name: 'a2ui-shadcn',
    description: 'Production-grade npm package mapping A2UI protocol v0.9 to shadcn/ui components. Build dynamic, agent-driven UIs with React, TypeScript, and Tailwind CSS.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['development', 'productivity', 'utilities'],
    lang: 'en',
    dir: 'ltr',
    orientation: 'any',
  };
}
