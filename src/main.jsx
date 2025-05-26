import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Homepage from "./components/Homepage";
import SignUp from "./components/forms/SignUp";
import LogIn from "./components/forms/LogIn";
// import LogIn from "./components/LoginForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "homepage", element: <Homepage /> },
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <LogIn /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
