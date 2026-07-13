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

function canAccessRoute(to: string, permissions?: string[]) {
  if (!permissions || permissions.length === 0) return true; // Standard fallback
  if (permissions.includes('*')) return true;

  const has = (k: string) => permissions.some(p => p.startsWith(k));

  if (to.includes('/orders') || to.includes('/refunds')) return has('orders');
  if (to.includes('/delivery') || to.includes('/assignments')) return has('deliveries') || has('production') || has('orders');
  if (to.includes('/products')) return has('products');
  if (to.includes('/inventory')) return has('inventory');
  if (to.includes('/customers')) return has('customers');
  if (to.includes('/consultations')) return has('consultations');
  if (to.includes('/accounting') || to.includes('/sales') || to.includes('/expenses') || to.includes('/reconciliation') || to.includes('/profit-loss') || to.includes('/rewards') || to.includes('/coupons')) return has('finance');
  if (to.includes('/team')) return has('staff');
  if (to.includes('/settings')) return has('settings');
  if (to.includes('/reports')) return has('reports');
  if (to.includes('/blog')) return has('marketing');
  
  return true; // Dashboard is visible if any permission exists
}

export function DashboardSidebar({ className, onItemClick }: DashboardSidebarProps) {
  const user = useAuthStore((s) => s.user);
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const platform = PLATFORM_CONFIG[activePlatform];
  const { data } = useAdminSummary();

  if (!user) return null;

  let sections = NAV_BY_ROLE[user.role] || [];
  
  if (user.permissions && user.permissions.length > 0 && !user.permissions.includes('*')) {
    sections = sections
      .map(section => ({
        ...section,
        items: section.items.filter(it => canAccessRoute(it.to, user.permissions))
      }))
      .filter(section => section.items.length > 0);
  }

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
