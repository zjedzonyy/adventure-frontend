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
import Settings from "./components/layout/Settings.jsx";
import Idea from "./components/layout/Idea.jsx";
import SearchIdeas from "./components/layout/SearchIdeas.jsx";
import AddIdea from "./components/layout/AddIdea.jsx";
import EditIdea from "./components/layout/EditIdea.jsx";
import UsersProfile from "./components/layout/UsersProfile.jsx";

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
        children: [
          { path: "profile/:userId", element: <UsersProfile /> },
          { path: "settings", element: <Settings /> },
          { path: "idea/:ideaId", element: <Idea /> },
          { path: "/ideas/search", element: <SearchIdeas /> },
          { path: "/add-idea", element: <AddIdea /> },
          { path: "/edit-idea/:ideaId", element: <EditIdea /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
