import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { PLATFORM_ADMIN_LABEL, PLATFORM_CONFIG } from "@/types/platform";

export function Logo({ className }: { className?: string }) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const platform = PLATFORM_CONFIG[activePlatform];

  return (
    <Link
      to="/"
      aria-label={`${PLATFORM_ADMIN_LABEL[activePlatform]} home`}
      className={cn(
        "inline-flex items-center gap-2 font-display text-[18px] tracking-tight text-ink",
        className,
      )}
    >
      <span className="grid place-items-center h-7 w-7 rounded-md bg-ink text-bg">
        <span className="font-display text-[13px] leading-none">{platform.logoInitial}</span>
      </span>
      <span>
        {platform.logoLabel}
        <span className="text-accent">.</span>{" "}
        <span className="text-ink-muted font-medium">admin</span>
      </span>
    </Link>
  );
}
