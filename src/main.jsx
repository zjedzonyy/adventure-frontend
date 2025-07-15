import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Homepage,
  AddIdea,
  EditIdea,
  Idea,
  Protected,
  SearchIdeas,
  LogIn,
  SignUp,
  UsersProfile,
  Settings,
  EditAccount,
} from "./components/pages";
import { RequireAuth, ProtectedRoutes } from "./components/auth/index.js";
import { ErrorPage, RouterErrorBoundary } from "./components/errors/index.js";
import { PrimeReactProvider } from "primereact/api";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouterErrorBoundary />,
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
        errorElement: <RouterErrorBoundary />,
        children: [
          { path: "profile/:userId", element: <UsersProfile /> },
          { path: "settings", element: <Settings /> },
          { path: "idea/:ideaId", element: <Idea /> },
          { path: "ideas/search", element: <SearchIdeas /> },
          { path: "add-idea", element: <AddIdea /> },
          { path: "edit-idea/:ideaId", element: <EditIdea /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  </StrictMode>
);
