import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Homepage,
  ErrorPage,
  Protected,
  AddIdea,
  EditIdea,
  Idea,
  SearchIdeas,
  LogIn,
  SignUp,
  UsersProfile,
  Settings,
  RouterErrorBoundary,
  EditAccount,
} from "./components/pages";
import { RequireAuth, ProtectedRoutes } from "./components/auth/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "homepage", element: <Homepage />, errorElement: <RouterErrorBoundary /> },
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
          { path: "ideas/search", element: <SearchIdeas /> },
          { path: "add-idea", element: <AddIdea /> },
          { path: "edit-idea/:ideaId", element: <EditIdea /> },
          { path: "edit-account", element: <EditAccount /> },
          { path: "*", element: <RouterErrorBoundary /> },
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
