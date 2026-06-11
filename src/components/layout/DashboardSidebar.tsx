import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { NAV_BY_ROLE } from "./navigation";
import { useAuthStore } from "@/store/auth-store";
import { useAdminSummary } from "@/features/admin/useAdminSummary";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_CONFIG, PLATFORM_SHORT_LABEL } from "@/types/platform";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export function DashboardSidebar({ className, onItemClick }: DashboardSidebarProps) {
  const user = useAuthStore((s) => s.user);
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const platform = PLATFORM_CONFIG[activePlatform];
  const { data } = useAdminSummary();

  if (!user) return null;

  const sections = NAV_BY_ROLE[user.role];

  return (
    <aside
      className={cn(
        "flex flex-col bg-surface border-r border-line/70",
        className,
      )}
    >
      <div className="h-14 flex items-center px-5 border-b border-line/70">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-2 mb-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((it) => {
                const Icon = it.icon;
                const badgeValue =
                  it.badgeKey && data?.counts
                    ? (data.counts as any)[it.badgeKey]
                    : undefined;

                return (
                  <li key={it.to}>
                    <NavLink
                      to={it.to}
                      onClick={onItemClick}
                      end={
                        it.to === "/admin" ||
                        it.to === "/manager" ||
                        it.to === "/accountant" ||
                        it.to === "/delivery" ||
                        it.to === "/consultant" ||
                        it.to === "/admin/accounting"
                      }
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                          isActive
                            ? "bg-surface-muted text-ink font-medium"
                            : "text-ink-muted hover:text-ink hover:bg-surface-muted/70",
                        )
                      }
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{it.label}</span>
                      </span>
                      {!!badgeValue && (
                        <Badge variant="warn" className="text-[10px] px-1.5 py-0">
                          {badgeValue}
                        </Badge>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-line/70 text-[11px] text-ink-muted leading-tight">
        <p className="font-medium text-ink">{PLATFORM_SHORT_LABEL[activePlatform]} operations</p>
        <p>{platform.sidebarTagline}</p>
      </div>
    </aside>
  );
}
