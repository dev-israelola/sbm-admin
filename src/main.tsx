import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import App from "@/App";
import { queryClient } from "@/lib/query-client";
import "@/index.css";

async function bootstrap() {
  const shouldUseMockApi = import.meta.env.VITE_ENABLE_MOCK_API === "true";

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
  } else if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations
        .filter((registration) => registration.active?.scriptURL.includes("mockServiceWorker"))
        .map((registration) => registration.unregister()),
    );
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
