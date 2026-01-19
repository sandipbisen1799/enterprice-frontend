import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/router.jsx";
import "./index.css";
import { ApiProvider } from "./context/contextApi.jsx"; // ✅ IMPORTANT
import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")).render(

    <ApiProvider>
          <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </ApiProvider>
  
);
