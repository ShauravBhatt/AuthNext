import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/signup" || path === "/forgot-password" || path === "/reset-password" || path === "/email-verification";

  const isProtectedPath = path === "/profile" || path === "/logout" || path === "/change-password";

  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/logout", "/signup", "/profile", "/change-password", "/email-vefrification",  "/forgot-password", "/reset-password", "/email-verifiation"],
};
