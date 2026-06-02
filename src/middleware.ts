import { NextResponse, type NextRequest } from "next/server";
import {
  getSubscriptionStatus,
  updateSession,
} from "@/lib/supabase/middleware";

const DASHBOARD_PREFIX = "/dashboard";
const AUTH_ROUTES = ["/login"];
const PUBLIC_API_PREFIXES = ["/api/webhooks"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const { supabase, user, supabaseResponse } = await updateSession(request);

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX);
  const isApi = pathname.startsWith("/api");

  if (isDashboard || (isApi && !pathname.startsWith("/api/webhooks"))) {
    if (!user) {
      if (isApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const { active } = await getSubscriptionStatus(supabase, user.id);

    if (!active) {
      if (isApi && !pathname.includes("/stripe/subscription")) {
        return NextResponse.json(
          { error: "Active subscription required", code: "SUBSCRIPTION_REQUIRED" },
          { status: 403 }
        );
      }
      if (isDashboard && pathname !== "/dashboard/billing") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard/billing";
        url.searchParams.set("subscribe", "required");
        return NextResponse.redirect(url);
      }
    }
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = user ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
