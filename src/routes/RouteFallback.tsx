import { Loader2 } from "lucide-react";

export function RouteFallback() {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-3 text-ink-muted min-h-[40vh]">
      <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden />
      <p className="text-[11px] uppercase tracking-[0.18em]">Loading</p>
    </div>
  );
}

export function FullScreenFallback() {
  return (
    <div className="min-h-dvh grid place-items-center bg-bg">
      <div className="flex flex-col items-center gap-3 text-ink-muted">
        <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden />
        <p className="text-[11px] uppercase tracking-[0.18em]">Loading</p>
      </div>
    </div>
  );
}
