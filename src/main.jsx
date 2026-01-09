import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/router.jsx";
import "./index.css";
import { ApiProvider } from "./context/contextApi.jsx"; // ✅ IMPORTANT
import React from "react";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApiProvider>
      <RouterProvider router={router} />
    </ApiProvider>
  </StrictMode>
);
