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
import { DEMO_CREDENTIALS } from "@/data/mock-users";
import { ROLE_HOME, ROLE_LABEL } from "@/types/role";
import { PLATFORM_CONFIG } from "@/types/platform";
import { Sparkles, Shield } from "lucide-react";

const schema = z.object({
  email: z.string().email("Use a valid email"),
  password: z.string().min(1, "Password required"),
});
type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const naturale = PLATFORM_CONFIG.harbs;
  const holistic = PLATFORM_CONFIG.holistic;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next");
  const login = useLogin();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const [busy, setBusy] = useState(false);

  async function submit(values: Values) {
    setBusy(true);
    try {
      const res = await login.mutateAsync(values);
      toast.success(`Welcome, ${res.user.fullName.split(" ")[0]}`);
      navigate(next ?? ROLE_HOME[res.user.role as keyof typeof ROLE_HOME], { replace: true });
    } catch (e) {
      toast.error("Couldn't sign in", { description: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  function pickDemo(role: typeof DEMO_CREDENTIALS[number]) {
    form.setValue("email", role.email);
    form.setValue("password", role.password);
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
          Internal use only · v0.1
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
            Use any demo credential below. Password is <code className="font-mono text-ink bg-surface-muted rounded px-1 py-0.5 text-[11px]">naturale</code>.
          </p>

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
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-7">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-muted mb-2 flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-accent" />
              Demo roles
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {DEMO_CREDENTIALS.map((c) => (
                <button
                  key={c.role}
                  type="button"
                  onClick={() => pickDemo(c)}
                  className="text-left rounded-md border border-line bg-surface px-3 py-2.5 hover:border-ink/30 transition-colors"
                >
                  <p className="text-[13px] font-medium text-ink">{ROLE_LABEL[c.role]}</p>
                  <p className="text-[11px] text-ink-muted">{c.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
