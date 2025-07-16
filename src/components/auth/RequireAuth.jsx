import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./index";
import { LoadingWrapper } from "../common/index";

// This component checks if the user is authenticated.
// If not, it redirects them to the login page.
// Saves original wanted destination
export default function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  return (
    <LoadingWrapper loading={loading}>
      {!user ? <Navigate to="/login" state={{ from: location }} replace /> : children}
    </LoadingWrapper>
  );
}
