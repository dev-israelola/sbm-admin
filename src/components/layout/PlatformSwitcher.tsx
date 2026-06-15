import { Building2, Check, ChevronDown, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import { ROLE_HOME } from "@/types/role";
import { ALL_PLATFORMS, PLATFORM_LABEL, type Platform } from "@/types/platform";

export function PlatformSwitcher() {
  const user = useAuthStore((s) => s.user);
  const sessions = useAuthStore((s) => s.sessions);
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const switchPlatform = useAuthStore((s) => s.switchPlatform);
  const navigate = useNavigate();

  if (!user || user.role !== "admin") return null;
  const userRole = user.role;

  function pick(platform: Platform) {
    if (platform === activePlatform) return;

    if (!sessions[platform]) {
      toast.info(`Sign in to ${PLATFORM_LABEL[platform]}`, {
        description: "That store does not have an active admin session yet.",
      });
      queryClient.clear();
      navigate(`/login?platform=${platform}&next=${encodeURIComponent(ROLE_HOME[userRole])}`);
      return;
    }

    const switched = switchPlatform(platform);
    if (!switched) return;
    queryClient.clear();
    navigate(ROLE_HOME[userRole]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-2.5 text-[12px] text-ink hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:px-3">
        <Building2 className="h-3.5 w-3.5 text-accent" />
        <span className="hidden font-medium sm:inline">{PLATFORM_LABEL[activePlatform]}</span>
        <ChevronDown className="h-3 w-3 text-ink-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[14rem]">
        <DropdownMenuLabel>Active platform</DropdownMenuLabel>
        {ALL_PLATFORMS.map((platform) => {
          const hasSession = Boolean(sessions[platform]);
          return (
            <DropdownMenuItem key={platform} onClick={() => pick(platform)}>
              <span className="flex w-full items-center gap-2">
                <Check
                  className={platform === activePlatform ? "h-3.5 w-3.5 text-accent" : "h-3.5 w-3.5 opacity-0"}
                  strokeWidth={3}
                />
                <span className="flex-1">{PLATFORM_LABEL[platform]}</span>
                {!hasSession ? <LogIn className="h-3.5 w-3.5 text-ink-muted" /> : null}
              </span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <p className="px-2 py-1 text-[10px] text-ink-muted">
          Stores switch only when that backend has accepted your credentials.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
