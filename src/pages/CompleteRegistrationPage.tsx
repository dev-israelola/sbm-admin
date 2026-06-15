import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Logo } from "@/components/layout/Logo";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { useAcceptInvite } from "@/features/auth/useAuth";
import { ROLE_HOME } from "@/types/role";
import { ALL_PLATFORMS, PLATFORM_CONFIG, type Platform } from "@/types/platform";

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters").max(72),
    confirm: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });
type Values = z.infer<typeof schema>;

function parsePlatform(value: string | null): Platform | undefined {
  return ALL_PLATFORMS.includes(value as Platform) ? (value as Platform) : undefined;
}

export default function CompleteRegistrationPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const platform = parsePlatform(params.get("platform"));
  const accept = useAcceptInvite();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: "", confirm: "" } });
  const [busy, setBusy] = useState(false);

  const invalid = !token || !platform;

  async function submit(values: Values) {
    if (!token || !platform) return;
    setBusy(true);
    try {
      const res = await accept.mutateAsync({ platform, token, password: values.password });
      toast.success(`Welcome, ${res.user.fullName.split(" ")[0]}`, {
        description: `Your account is active on ${PLATFORM_CONFIG[platform].shortLabel}.`,
      });
      // The platform from the invite link decides which store we sign in to.
      navigate(ROLE_HOME[res.user.role], { replace: true });
    } catch (e) {
      toast.error("Couldn't update your password", { description: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh grid place-items-center bg-bg p-6">
      <div className="w-full max-w-sm">
        <Logo />
        <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-ink-muted">Staff invite</p>
        <h2 className="font-display text-2xl mt-1.5 text-ink">Complete your registration</h2>
        <p className="text-[13px] text-ink-muted mt-1">
          Set a password to activate your admin account
          {platform ? ` for ${PLATFORM_CONFIG[platform].shortLabel}` : ""}.
        </p>

        {invalid ? (
          <p className="mt-6 rounded-md border border-line bg-surface-muted px-3 py-3 text-[13px] text-ink-muted">
            This invite link is invalid or incomplete. Ask an admin to send you a new invitation.
          </p>
        ) : (
          <form className="mt-7 space-y-3" onSubmit={form.handleSubmit(submit)}>
            <FormInput
              label="Password"
              type="password"
              {...form.register("password")}
              error={form.formState.errors.password?.message}
              autoComplete="new-password"
            />
            <FormInput
              label="Confirm password"
              type="password"
              {...form.register("confirm")}
              error={form.formState.errors.confirm?.message}
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
