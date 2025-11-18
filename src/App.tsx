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
    path: "/:id",
    element: <Guest />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
