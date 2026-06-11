import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useUIStore } from "@/store/ui-store";
import { RouteFallback } from "@/routes/RouteFallback";
import { ErrorBoundary } from "@/routes/ErrorBoundary";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function DashboardLayout() {
  const mobileOpen = useUIStore((s) => s.mobileSidebarOpen);
  const setMobile = useUIStore((s) => s.setMobileSidebarOpen);

  return (
    <div className="min-h-dvh bg-bg">
      <ScrollToTop />
      <div className="flex">
        <DashboardSidebar className="hidden lg:flex w-64 sticky top-0 self-start h-dvh" />

        <Sheet open={mobileOpen} onOpenChange={setMobile}>
          <SheetContent side="left" className="p-0 w-72 lg:hidden" hideClose>
            <DashboardSidebar className="w-full h-full" onItemClick={() => setMobile(false)} />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <DashboardHeader />
          <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-5 lg:px-8 lg:py-8">
            <ErrorBoundary>
              <Suspense fallback={<RouteFallback />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
}
