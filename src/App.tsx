import { Suspense } from "react";
import { AppRoutes } from "@/routes/AppRoutes";
import { ErrorBoundary } from "@/routes/ErrorBoundary";
import { FullScreenFallback } from "@/routes/RouteFallback";

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FullScreenFallback />}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  );
}
