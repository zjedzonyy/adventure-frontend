import { useRouteError, useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const RouterErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Navigation
  const handleGoHome = () => navigate("/");
  const handleGoBack = () => navigate(-1);
  const handleRefresh = () => window.location.reload();

  // Describe error type
  const getErrorType = error => {
    if (error?.status === 404) return "404";
    if (error?.status === 400) return "400";
    if (error?.status === 500) return "500";
    if (error?.status === 403) return "403";
    if (error?.name === "NetworkError") return "network";
    return "generic";
  };

  // Describe error
  const getErrorContent = error => {
    const type = getErrorType(error);

    switch (type) {
      case "404":
        return {
          title: "Page Not Found",
          message: error?.statusText || "The page you're looking for doesn't exist.",
        };
      case "403":
        return {
          title: "Access Denied",
          message: error?.statusText || "You don’t have permission to view this page.",
        };
      case "400":
        return {
          title: "Bad Request",
          message: error?.statusText || "There was an issue with your request.",
        };
      case "500":
        return {
          title: "Server Error",
          message: error?.statusText || "Something went wrong on our end.",
        };
      case "network":
        return {
          title: "Connection Problem",
          message: "Unable to connect to our servers.",
        };
      default:
        return {
          title: "Something Went Wrong",
          message: error?.message || "An unexpected error occurred.",
        };
    }
  };

  const { title, message } = getErrorContent(error);
  const errorType = getErrorType(error);

  // Logs in dev
  if (process.env.NODE_ENV === "development") {
    console.error("Router Error:", error);
  }

  return (
    <ErrorPage
      errorType={errorType}
      title={title}
      message={message}
      onGoHome={handleGoHome}
      onGoBack={handleGoBack}
      onRefresh={handleRefresh}
      showRefresh={true}
      showGoBack={true}
    />
  );
};

export default RouterErrorBoundary;
