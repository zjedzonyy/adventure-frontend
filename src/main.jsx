import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Homepage from "./components/Homepage";
import SignUp from "./components/forms/SignUp";
import LogIn from "./components/forms/LogIn";
import Protected from "./components/layout/Protected.jsx";
import RequireAuth from "./components/common/RequireAuth.jsx";
import ProtectedRoutes from "./components/common/ProtectedRoutes.jsx";
import MyProfile from "./components/layout/MyProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "homepage", element: <Homepage /> },
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <LogIn /> },
      {
        element: (
          <RequireAuth>
            <ProtectedRoutes />
          </RequireAuth>
        ),
        children: [{ path: "me", element: <MyProfile /> }],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
