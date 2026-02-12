"use client";

import { useEffect } from "react";

/**
 * Constrains html and body to 100dvh when on playground route.
 * Prevents body's min-h-screen (100vh) from creating scrollable content
 * behind the fixed playground on iOS, where 100vh > 100dvh.
 * Disables pull-to-refresh via overscroll-behavior and position: fixed.
 */
export function PlaygroundViewportController() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtml = {
      overflow: html.style.overflow,
      height: html.style.height,
      minHeight: html.style.minHeight,
      overscrollBehavior: html.style.overscrollBehavior,
    };
    const prevBody = {
      overflow: body.style.overflow,
      height: body.style.height,
      minHeight: body.style.minHeight,
      position: body.style.position,
      inset: body.style.inset,
      overscrollBehavior: body.style.overscrollBehavior,
    };

    html.style.overflow = "hidden";
    html.style.height = "100dvh";
    html.style.minHeight = "100dvh";
    html.style.overscrollBehavior = "none";

    body.style.overflow = "hidden";
    body.style.height = "100dvh";
    body.style.minHeight = "100dvh";
    body.style.position = "fixed";
    body.style.inset = "0";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = prevHtml.overflow;
      html.style.height = prevHtml.height;
      html.style.minHeight = prevHtml.minHeight;
      html.style.overscrollBehavior = prevHtml.overscrollBehavior;

      body.style.overflow = prevBody.overflow;
      body.style.height = prevBody.height;
      body.style.minHeight = prevBody.minHeight;
      body.style.position = prevBody.position;
      body.style.inset = prevBody.inset;
      body.style.overscrollBehavior = prevBody.overscrollBehavior;
    };
  }, []);

  return null;
}
