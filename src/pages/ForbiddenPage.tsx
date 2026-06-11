import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { ROLE_HOME } from "@/types/role";

export default function ForbiddenPage() {
  const user = useAuthStore((s) => s.user);
  const home = user ? ROLE_HOME[user.role] : "/login";
  return (
    <div className="min-h-dvh grid place-items-center bg-bg px-6">
      <div className="text-center max-w-md">
        <span className="inline-grid place-items-center h-12 w-12 rounded-full bg-surface-muted text-ink-muted">
          <Lock className="h-5 w-5" />
        </span>
        <p className="eyebrow mt-4">403</p>
        <h1 className="font-display text-2xl mt-1 text-ink">You don't have access to this area.</h1>
        <p className="text-sm text-ink-muted mt-2 leading-relaxed">
          Switch role or contact an administrator if this looks wrong.
        </p>
        <Button asChild className="mt-6">
          <Link to={home}>Back to your dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
