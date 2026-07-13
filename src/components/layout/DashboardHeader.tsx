import { Bell, LogOut, Menu, Search, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/features/notifications/useNotifications";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { PlatformSwitcher } from "./PlatformSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_HOME, ROLE_LABEL } from "@/types/role";
import type { AdminNotification } from "@/types/notification";

function formatNotificationTime(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function notificationTarget(notification: AdminNotification, roleHome: string) {
  // Prefer a precise deep-link to the related entity when we have one.
  const id = notification.resourceId;
  switch (notification.resourceType) {
    case "order":
      return id ? `${roleHome}/orders/${id}` : `${roleHome}/orders`;
    case "refund":
      return id ? `${roleHome}/refunds/${id}` : `${roleHome}/refunds`;
    case "delivery":
      return id ? `${roleHome}/delivery/${id}` : `${roleHome}/delivery`;
    case "consultation":
      return id ? `${roleHome}/consultations/${id}` : `${roleHome}/consultations`;
    case "product":
      return `${roleHome}/inventory`;
  }
  // Fallback to the section based on the notification type prefix.
  if (notification.type.startsWith("refund.")) return `${roleHome}/refunds`;
  if (notification.type.startsWith("order.")) return `${roleHome}/orders`;
  if (notification.type.startsWith("consultation.")) return `${roleHome}/consultations`;
  if (notification.type.startsWith("delivery.")) return `${roleHome}/delivery`;
  if (notification.type.startsWith("inventory.")) return `${roleHome}/inventory`;
  return roleHome;
}

export function DashboardHeader() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const setMobile = useUIStore((s) => s.setMobileSidebarOpen);
  const navigate = useNavigate();
  const notifications = useNotifications(8);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const roleHome = user ? ROLE_HOME[user.role] : "/admin";
  const notificationItems = notifications.data?.items ?? [];
  const unreadCount = notifications.data?.unreadCount ?? 0;

  const openNotification = (notification: AdminNotification) => {
    if (!notification.readAt) markRead.mutate(notification.id);
    navigate(notificationTarget(notification, roleHome));
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line/70 bg-surface/95 px-4 backdrop-blur lg:gap-3 lg:px-6">
      <button
        type="button"
        aria-label="Open menu"
        className="lg:hidden grid place-items-center h-9 w-9 rounded-md text-ink hover:bg-surface-muted"
        onClick={() => setMobile(true)}
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
        <input
          type="search"
          placeholder="Search orders, products, customers…"
          className="h-9 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm placeholder:text-ink-muted/70 focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
        />
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-2">
        <PlatformSwitcher />
        <button
          type="button"
          onClick={() => useUIStore.getState().setHelpDrawerOpen(true)}
          className="grid place-items-center h-9 w-9 rounded-md text-ink hover:bg-surface-muted focus-visible:outline-none"
          title="Help & Knowledge Base"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Notifications"
            className="relative grid place-items-center h-9 w-9 rounded-md text-ink hover:bg-surface-muted focus-visible:outline-none"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[22rem] max-w-[calc(100vw-1rem)] p-0">
            <div className="flex items-center justify-between border-b border-line/70 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-ink">Notifications</p>
                <p className="text-[11px] text-ink-muted">
                  {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-[11px] font-medium text-accent hover:bg-surface-muted"
                  onClick={() => markAllRead.mutate()}
                >
                  Mark all read
                </button>
              )}
            </div>
            {notifications.isLoading ? (
              <p className="px-3 py-6 text-center text-sm text-ink-muted">Loading notifications...</p>
            ) : notificationItems.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-ink-muted">No notifications yet.</p>
            ) : (
              <div className="max-h-[24rem] overflow-y-auto p-1">
                {notificationItems.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="block cursor-pointer px-3 py-2"
                    onSelect={() => openNotification(notification)}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={
                          notification.readAt
                            ? "mt-1.5 h-2 w-2 rounded-full bg-line"
                            : "mt-1.5 h-2 w-2 rounded-full bg-accent"
                        }
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium text-ink">{notification.title}</span>
                        {notification.body && (
                          <span className="mt-0.5 block line-clamp-2 text-[12px] leading-relaxed text-ink-muted">
                            {notification.body}
                          </span>
                        )}
                        <span className="mt-1 block text-[10px] text-ink-muted">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-9 items-center gap-2 rounded-md px-2 hover:bg-surface-muted focus-visible:outline-none"
            aria-label="Account menu"
          >
            <span className="grid place-items-center h-7 w-7 rounded-full bg-accent text-accent-ink text-[12px] font-medium">
              {user?.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
            <span className="hidden min-w-0 md:flex md:flex-col md:text-left md:leading-tight">
              <p className="text-[13px] font-medium leading-none text-ink">{user?.fullName}</p>
              <span className="text-[10px] text-ink-muted">{user ? (user.customRoleName || ROLE_LABEL[user.role]) : ""}</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[14rem]">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
                navigate("/login");
              }}
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
