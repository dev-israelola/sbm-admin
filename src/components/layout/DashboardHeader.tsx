import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { PlatformSwitcher } from "./PlatformSwitcher";
import { RoleSwitcher } from "./RoleSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABEL } from "@/types/role";

export function DashboardHeader() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const setMobile = useUIStore((s) => s.setMobileSidebarOpen);
  const navigate = useNavigate();

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
        <RoleSwitcher />
        <button
          type="button"
          aria-label="Notifications"
          className="grid place-items-center h-9 w-9 rounded-md text-ink hover:bg-surface-muted"
        >
          <Bell className="h-4 w-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-9 items-center gap-2 rounded-md px-2 hover:bg-surface-muted focus-visible:outline-none"
            aria-label="Account menu"
          >
            <span className="grid place-items-center h-7 w-7 rounded-full bg-accent text-accent-ink text-[12px] font-medium">
              {user?.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
            <span className="hidden min-w-0 md:flex md:flex-col md:text-left md:leading-tight">
              <span className="text-[12px] text-ink font-medium">{user?.fullName}</span>
              <span className="text-[10px] text-ink-muted">{user ? ROLE_LABEL[user.role] : ""}</span>
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
