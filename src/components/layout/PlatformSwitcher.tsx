import { Building2, Check, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { PLATFORM_LABEL, type Platform } from "@/types/platform";

export function PlatformSwitcher() {
  const user = useAuthStore((s) => s.user);
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const switchPlatform = useAuthStore((s) => s.switchPlatform);
  const navigate = useNavigate();

  if (!user || user.role !== "admin" || user.platforms.length < 2) return null;
  const platforms = user.platforms;
  const userRole = user.role;

  function pick(platform: Platform) {
    switchPlatform(platform);
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
        {platforms.map((platform) => (
          <DropdownMenuItem key={platform} onClick={() => pick(platform)}>
            <span className="flex w-full items-center gap-2">
              <Check className={platform === activePlatform ? "h-3.5 w-3.5 text-accent" : "h-3.5 w-3.5 opacity-0"} strokeWidth={3} />
              {PLATFORM_LABEL[platform]}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <p className="px-2 py-1 text-[10px] text-ink-muted">Switches the whole admin context.</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
