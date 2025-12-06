import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { QueryProvider } from "./lib/react-query/QueryProvider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NuqsAdapter>
    <QueryProvider>
      <TooltipProvider>
        <Toaster />
        <App />
      </TooltipProvider>
    </QueryProvider>
  </NuqsAdapter>
);
