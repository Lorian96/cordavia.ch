import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return new NextResponse("Admin not configured", { status: 503 });
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Cordavia Admin"' },
    });
  }

  let pass = "";
  try {
    const decoded = atob(auth.slice(6));
    pass = decoded.split(":").slice(1).join(":");
  } catch {
    return new NextResponse("Invalid credentials", { status: 401 });
  }

  if (pass !== expected) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Cordavia Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
