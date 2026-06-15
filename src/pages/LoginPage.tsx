import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Logo } from "@/components/layout/Logo";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/features/auth/useAuth";
import { ROLE_HOME } from "@/types/role";
import { ALL_PLATFORMS, PLATFORM_CONFIG, type Platform } from "@/types/platform";
import { Sparkles } from "lucide-react";

const schema = z.object({
  email: z.string().email("Use a valid email"),
  password: z.string().min(1, "Password required"),
});
type Values = z.infer<typeof schema>;

function parsePlatform(value: string | null): Platform | undefined {
  return ALL_PLATFORMS.includes(value as Platform) ? (value as Platform) : undefined;
}

export default function LoginPage() {
  const naturale = PLATFORM_CONFIG.naturale;
  const holistic = PLATFORM_CONFIG.holistic;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next");
  const preferredPlatform = parsePlatform(params.get("platform"));
  const login = useLogin();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const [busy, setBusy] = useState(false);

  async function submit(values: Values) {
    setBusy(true);
    try {
      const res = await login.mutateAsync({ ...values, preferredPlatform });
      const platformLabel = PLATFORM_CONFIG[res.activePlatform].shortLabel;
      toast.success(`Welcome, ${res.user.fullName.split(" ")[0]}`, {
        description: `Signed in to ${platformLabel}.`,
      });
      navigate(next ?? ROLE_HOME[res.user.role], { replace: true });
    } catch (e) {
      toast.error("Couldn't sign in", { description: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh grid lg:grid-cols-[1fr_1.1fr] bg-bg">
      <section className="hidden lg:flex flex-col justify-between bg-ink text-bg p-10 relative overflow-hidden">
        <Logo className="text-bg [&_span:first-child]:bg-bg [&_span:first-child]:text-ink [&_span:nth-child(3)]:text-bg/70" />
        <div className="relative z-10">
          <Sparkles className="h-4 w-4 text-accent-soft" />
          <h1 className="mt-4 font-display text-3xl leading-tight max-w-md">
            One shared admin for <span className="italic text-accent-soft">{naturale.label}</span> and {holistic.label}.
          </h1>
          <p className="mt-4 text-sm text-bg/70 max-w-md leading-relaxed">
            Orders, inventory, delivery, consultations, and accounting in one place while each platform keeps its
            own operational data.
          </p>
        </div>
        <div className="relative z-10 text-[11px] uppercase tracking-[0.18em] text-bg/55">
          Internal use only - v0.1
        </div>
        <div
          aria-hidden
          className="absolute -right-32 -bottom-32 w-[480px] h-[480px] rounded-full bg-accent/25 blur-3xl"
        />
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Logo /></div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">Sign in</p>
          <h2 className="font-display text-2xl mt-1.5 text-ink">Welcome to the shared admin</h2>
          <p className="text-[13px] text-ink-muted mt-1">
            Use your admin credentials. We will check Naturale and Holistic automatically.
          </p>
          {preferredPlatform ? (
            <p className="mt-3 rounded-md border border-line bg-surface-muted px-3 py-2 text-[12px] text-ink-muted">
              Sign in to access {PLATFORM_CONFIG[preferredPlatform].shortLabel}. If these credentials belong to a
              different store, we will send you there instead.
            </p>
          ) : null}

          <form className="mt-7 space-y-3" onSubmit={form.handleSubmit(submit)}>
            <FormInput
              label="Email"
              type="email"
              {...form.register("email")}
              error={form.formState.errors.email?.message}
              autoComplete="email"
            />
            <FormInput
              label="Password"
              type="password"
              {...form.register("password")}
              error={form.formState.errors.password?.message}
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
