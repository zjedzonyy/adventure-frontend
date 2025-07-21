/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";

// Return Boolean to check if we should render Spinner
function useDelayedLoading(loading, delay = 300) {
  const [showSpinner, setShowSpinner] = useState(false);

  // function delay(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  useEffect(() => {
    if (loading) {
      setShowSpinner(false);
      const timeout = setTimeout(() => setShowSpinner(true), delay);
      return () => clearTimeout(timeout);
    } else {
      setShowSpinner(false);
    }
  }, [loading, delay]);

  return showSpinner;
}

// Render prop pattern
export default function LoadingWrapper({
  loading,
  delay = 300,
  loadingText = "",
  children,
  page = true,
  size = "large",
}) {
  const showSpinner = useDelayedLoading(loading, delay);

  if (loading && showSpinner) {
    if (page) {
      return (
        <div data-testid="spinner" className="min-h-screen flex items-center justify-center">
          <Atom color="#c031cc" size={size} text={loadingText} textColor="" />
        </div>
      );
    }
    return (
      <div data-testid="spinner" className="flex items-center justify-center">
        <Atom color="#c031cc" size={size} text={loadingText} textColor="" />
      </div>
    );
  }

  if (loading && !showSpinner) {
    return null;
  }

  // if loading === false => render children
  return children;
}
