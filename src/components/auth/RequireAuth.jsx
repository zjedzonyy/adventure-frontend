import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./index";

// This component checks if the user is authenticated.
// If not, it redirects them to the login page.
// Saves original wanted destination
export default function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSpinner(true), 300); // show spinner ONLY after 300ms

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return showSpinner ? (
      <div className="min-h-screen flex items-center justify-center">
        <Atom color="#c031cc" size="large" text="" textColor="" />
      </div>
    ) : null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
