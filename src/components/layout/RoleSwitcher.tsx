import { Check, ChevronDown, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { ROLE_LABEL, ROLE_HOME, type Role } from "@/types/role";

const ROLES: Role[] = ["admin", "manager", "accountant", "delivery", "consultant"];

export function RoleSwitcher() {
  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);
  const navigate = useNavigate();
  if (!user) return null;

  function pick(role: Role) {
    switchRole(role);
    navigate(ROLE_HOME[role]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-2.5 text-[12px] text-ink hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:px-3">
        <Shield className="h-3.5 w-3.5 text-accent" />
        <span className="hidden font-medium sm:inline">{ROLE_LABEL[user.role]}</span>
        <ChevronDown className="h-3 w-3 text-ink-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuLabel>Switch role</DropdownMenuLabel>
        {ROLES.map((r) => (
          <DropdownMenuItem key={r} onClick={() => pick(r)}>
            <span className="flex items-center gap-2 w-full">
              <Check className={r === user.role ? "h-3.5 w-3.5 text-accent" : "h-3.5 w-3.5 opacity-0"} strokeWidth={3} />
              {ROLE_LABEL[r]}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <p className="px-2 py-1 text-[10px] text-ink-muted">Demo only — for codex review.</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
