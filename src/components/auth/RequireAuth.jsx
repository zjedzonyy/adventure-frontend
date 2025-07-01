import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./index";

// This component checks if the user is authenticated.
// If not, it redirects them to the login page.
export default function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
