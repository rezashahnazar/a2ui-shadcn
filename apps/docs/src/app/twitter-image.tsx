import { ImageResponse } from 'next/og';

export const alt = 'a2ui-shadcn - A2UI Protocol Renderer for shadcn/ui';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Reuse the same image as OpenGraph
export { default } from './opengraph-image';
