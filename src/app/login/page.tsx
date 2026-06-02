import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign In | AURA MUSIC",
  description: "Access your music agency command center",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.08), transparent)",
        }}
      />
      <Suspense fallback={<div className="text-white/40">Loading...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
