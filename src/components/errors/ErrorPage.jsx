import { useContext } from "react";
import { AuthContext } from "../auth/index.js";
import { AlertTriangle, Home, RefreshCw, ArrowLeft, Search, Bug, Wifi, Server } from "lucide-react";

const ErrorPage = ({
  errorType = "404",
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  onGoHome = () => (window.location.href = "/"),
  onGoBack = () => window.history.back(),
  onRefresh = () => window.location.reload(),
  showRefresh = true,
  showGoBack = true,
}) => {
  const { showToast } = useContext(AuthContext);
  const getErrorConfig = type => {
    switch (type) {
      case "404":
        return {
          icon: <Search className="w-16 h-16" />,
          color: "purple",
          bgGradient: "from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20",
          iconBg: "from-purple-600 to-blue-600",
          primaryBtn:
            "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
        };
      case "403":
        return {
          icon: <AlertTriangle className="w-16 h-16" />,
          color: "yellow",
          bgGradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
          iconBg: "from-yellow-600 to-amber-600",
          primaryBtn:
            "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700",
        };
      case "400":
        return {
          icon: <AlertTriangle className="w-16 h-16" />,
          color: "orange",
          bgGradient: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
          iconBg: "from-orange-600 to-red-600",
          primaryBtn:
            "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700",
        };
      case "500":
        return {
          icon: <Server className="w-16 h-16" />,
          color: "red",
          bgGradient: "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
          iconBg: "from-red-600 to-pink-600",
          primaryBtn:
            "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700",
        };
      case "network":
        return {
          icon: <Wifi className="w-16 h-16" />,
          color: "blue",
          bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
          iconBg: "from-blue-600 to-indigo-600",
          primaryBtn:
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
        };
      default:
        return {
          icon: <Bug className="w-16 h-16" />,
          color: "gray",
          bgGradient: "from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20",
          iconBg: "from-gray-600 to-slate-600",
          primaryBtn:
            "bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700",
        };
    }
  };

  const config = getErrorConfig(errorType);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      {/* Main Error Content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-8 sm:p-12">
            {/* Error Icon and Code */}
            <div className="mb-8">
              <div
                data-testid="test-icon"
                className={`w-24 h-24 bg-gradient-to-r ${config.iconBg} rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}
              >
                {config.icon}
              </div>

              <div className="mb-4">
                <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-300 leading-none">
                  {errorType}
                </h1>
              </div>
            </div>

            {/* Error Title and Message */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                {message}
              </p>
            </div>

            {/* Decorative Element */}
            <div
              className={`w-full h-2 bg-gradient-to-r ${config.bgGradient} rounded-full mb-8 opacity-60`}
            ></div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary Action - Go Home */}
              <button
                onClick={onGoHome}
                className={`${config.primaryBtn} text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 w-full sm:w-auto`}
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </button>

              {/* Secondary Actions */}
              <div className="flex gap-3 w-full sm:w-auto">
                {showGoBack && (
                  <button
                    onClick={onGoBack}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium px-6 py-4 rounded-xl transition-colors duration-300 flex items-center space-x-2 flex-1 sm:flex-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Go Back</span>
                  </button>
                )}

                {showRefresh && (
                  <button
                    onClick={onRefresh}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium px-6 py-4 rounded-xl transition-colors duration-300 flex items-center space-x-2 flex-1 sm:flex-none"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                )}
              </div>
            </div>

            {/* Additional Info */}
            {errorType === "404" && (
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Tip:</span> Check the URL for typos or try
                  searching for what you need.
                </p>
              </div>
            )}

            {errorType === "400" && (
              <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  <span className="font-semibold">Bad Request:</span> There was an issue with your
                  request. Please try again.
                </p>
              </div>
            )}

            {errorType === "500" && (
              <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <span className="font-semibold">Server Error:</span> Something went wrong on our
                  end. We&apos;re working to fix it.
                </p>
              </div>
            )}

            {errorType === "network" && (
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Connection Issue:</span> Please check your
                  internet connection and try again.
                </p>
              </div>
            )}
          </div>

          {/* Footer Help Text */}
          <div className="mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help? Contact our support team or check our{" "}
              <button
                onClick={() =>
                  showToast({
                    severity: "error",
                    detail: "We got u!",
                  })
                }
                className={`text-${config.color}-600 hover:text-${config.color}-700 dark:text-${config.color}-400 dark:hover:text-${config.color}-300 font-medium hover:underline transition-colors`}
              >
                help center
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
