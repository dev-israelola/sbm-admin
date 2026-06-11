import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import App from "@/App";
import { queryClient } from "@/lib/query-client";
import "@/index.css";

async function bootstrap() {
  // Demo build has no real backend, so the MSW mock API runs in production too.
  // Set VITE_ENABLE_MOCK_API=false (e.g. when wiring a real backend) to disable.
  const shouldUseMockApi = import.meta.env.VITE_ENABLE_MOCK_API !== "false";

  if (shouldUseMockApi) {
    try {
      const { worker } = await import("@/mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: { url: "/mockServiceWorker.js" },
      });
    } catch (error) {
      console.error("Mock API failed to start.", error);
    }
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            theme="light"
            richColors
            closeButton
            toastOptions={{ className: "!font-sans !rounded-xl !border-line" }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

bootstrap();
