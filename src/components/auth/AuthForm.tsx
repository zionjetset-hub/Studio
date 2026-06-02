"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Music2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type AuthMode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (signUpError) throw signUpError;
        setMessage("Check your email to confirm your account.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
          <Music2 className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          AURA MUSIC
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Premium music agency platform
        </p>
      </div>

      <div className="glow-card glow-border-active p-8">
        <div className="mb-6 flex rounded-xl border border-white/10 bg-black p-1">
          {(["login", "signup"] as AuthMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium capitalize transition-all duration-300 ${
                mode === m
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
                Full Name
              </label>
              <input
                type="text"
                className="input-luxury"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={mode === "signup"}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
              Email
            </label>
            <input
              type="email"
              className="input-luxury"
              placeholder="you@artist.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
              Password
            </label>
            <input
              type="password"
              className="input-luxury"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
          {message && (
            <p className="text-sm text-emerald-400 text-center">{message}</p>
          )}

          <Button type="submit" className="w-full mt-2" loading={loading}>
            {mode === "login" ? "Enter Platform" : "Create Account"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-white/25">
        $25/month platform access · Secure authentication via Supabase
      </p>
    </div>
  );
}
