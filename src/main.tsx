import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WindowLayout } from "./layouts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WindowLayout></WindowLayout>
    </ThemeProvider>
  </React.StrictMode>
);

// Safely access ipcRenderer with proper initialization check
if (typeof window !== "undefined" && window.ipcRenderer) {
  window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
  });
} else {
  console.warn(
    "ipcRenderer not available - this is expected in development mode"
  );
}

// Alternative: Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  if (window.ipcRenderer) {
    window.ipcRenderer.on("main-process-message", (_event, message) => {
      console.log(message);
    });
  }
});
