"use client";

import { useEffect } from "react";

/**
 * Constrains html and body to 100dvh when on playground route.
 * Prevents body's min-h-screen (100vh) from creating scrollable content
 * behind the fixed playground on iOS, where 100vh > 100dvh.
 */
export function PlaygroundViewportController() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtml = {
      overflow: html.style.overflow,
      height: html.style.height,
      minHeight: html.style.minHeight,
    };
    const prevBody = {
      overflow: body.style.overflow,
      height: body.style.height,
      minHeight: body.style.minHeight,
    };

    html.style.overflow = "hidden";
    html.style.height = "100dvh";
    html.style.minHeight = "100dvh";
    body.style.overflow = "hidden";
    body.style.height = "100dvh";
    body.style.minHeight = "100dvh";

    return () => {
      html.style.overflow = prevHtml.overflow;
      html.style.height = prevHtml.height;
      html.style.minHeight = prevHtml.minHeight;
      body.style.overflow = prevBody.overflow;
      body.style.height = prevBody.height;
      body.style.minHeight = prevBody.minHeight;
    };
  }, []);

  return null;
}
