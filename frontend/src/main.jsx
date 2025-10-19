import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Layout and pages
import Layout from "./components/Layout.jsx";  // 👈 we'll make this below
import App from "./App.jsx";                   // Home page
import DiningServices from "./pages/DiningServices.jsx"; // Dining page

const router = createBrowserRouter([
  {
    path: "/",              // The root layout
    element: <Layout />,    // Navbar + Header stay here
    children: [
      { index: true, element: <App /> },          // Home page
      { path: "dining", element: <DiningServices /> }, // Dining page
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
