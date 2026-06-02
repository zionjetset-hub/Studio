import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user, supabaseResponse };
}

export async function getSubscriptionStatus(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<{ active: boolean; status: string }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", userId)
    .single();

  const status = profile?.subscription_status ?? "inactive";
  const active = status === "active" || status === "trialing";

  return { active, status };
}
