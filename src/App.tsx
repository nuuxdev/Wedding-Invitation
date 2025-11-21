"use client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./Admin";
import Guest from "./Guest";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Admin />,
  },
  {
    path: "/error",
    element: <div>Oops! this link is invalid!</div>,
  },
  {
    path: "/:id",
    element: <Guest />,
  },
]);

import { LanguageProvider } from "./LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
