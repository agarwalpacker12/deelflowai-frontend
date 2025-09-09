import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { getCsrfToken } from './services/api.js';
import { initializeErrorSuppression } from "./utils/errorSuppression.js";
import queryClient from "./lib/react-query-client.js";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";

// Import radix theme styles
import "@radix-ui/themes/styles.css";

// Fetch the CSRF cookie before the app starts
// getCsrfToken();

// Initialize Codespaces HMR fixes FIRST (before Vite's HMR client loads)
if (import.meta.env.DEV) {
  import("./utils/codespaces-hmr.js");
}

// Initialize error suppression for development environment
initializeErrorSuppression();

// Initialize custom HMR client for Codespaces
if (import.meta.env.DEV) {
  import("../vite-hmr-client.js");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        closeButton={false}
        limit={3}
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Theme
        appearance="light"
        accentColor="blue"
        grayColor="mauve"
        radius="large"
        scaling="100%"
      >
        <App />
      </Theme>
    </QueryClientProvider>
  </React.StrictMode>
);
