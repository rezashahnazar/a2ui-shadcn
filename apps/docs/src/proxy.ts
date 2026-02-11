import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Redirect /docs to /docs/introduction
  if (request.nextUrl.pathname === "/docs") {
    return NextResponse.redirect(new URL("/docs/introduction", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/docs",
};
