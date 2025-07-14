import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { apiUrl } from "../../utils/api.js";
import {
  Search,
  Compass,
  Users,
  Heart,
  Star,
  Plus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react";
import { AuthContext } from "../auth/index";
import { LoadingWrapper } from "../common/index.js";

export default function LogIn() {
  const [error, setError] = useState("");
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
  });
  const [demoData, setDemoData] = useState({
    username: "TestUser2",
    password: "Password1",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { darkMode, toggleDarkMode, loginUser, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    // Check if username and password are not empty
    if (registerData.username && registerData.password) {
      setError("");
      return true;
    }
    setError("Please fill in all fields correctly:");
    return false;
  };

  const handleSubmit = async (e) => {
    if (validate()) {
      e.preventDefault();
      try {
        console.log("Sending login request to:", `${apiUrl}/auth/login`);
        console.log("Login data:", registerData);

        setLoading(true);
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData),
          credentials: "include",
        });

        console.log(" Login response status:", res.status);
        console.log(" Login response headers:", Object.fromEntries(res.headers.entries()));

        const data = await res.json();
        console.log("Login response data:", data);

        if (data.name) {
          console.log("Login failed:", data.message);
          setError(data.message);
        } else {
          console.log("Login successful, calling loginUser with:", data.data);

          // Call loginUser and wait for it
          await loginUser(data.data);

          console.log("loginUser completed");

          // Double check user state
          console.log(" Current user context after login:", user);

          const from = location.state?.from || "/";
          console.log("Navigating to:", from);
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error(" Login request failed:", error);
        setError("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill in all fields correctly:");
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoData),
        credentials: "include",
      });
      const data = await res.json();
      if (data.name) {
        setError(data.message);
      } else {
        // Handle successful demo login
        await loginUser(data.data);
        const from = location.state?.from || "/";
        navigate(from, { replace: true }); // Redirect to destination or homepage after demo login
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingWrapper loading={loading}>
      <div
        className={`min-h-screen transition-all duration-500 ease-in-out flex items-center justify-center ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500"
        }`}
      >
        <button
          onClick={toggleDarkMode}
          className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 z-10 ${
            darkMode
              ? "bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm border border-gray-600/30"
              : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          }`}
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400 transition-all duration-300 ease-in-out" />
          ) : (
            <Moon className="w-6 h-6 text-gray-100 transition-all duration-300 ease-in-out" />
          )}
        </button>

        <div
          className={`rounded-2xl shadow-2xl px-8 py-6 w-full max-w-md transition-all duration-500 ease-in-out transform ${
            darkMode
              ? "bg-gray-800/90 backdrop-blur-lg border border-gray-700/50"
              : "bg-white/95 backdrop-blur-lg"
          }`}
        >
          <div className="text-center mb-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 ease-in-out transform hover:rotate-12 ${
                darkMode
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25"
              }`}
            >
              <Compass className="w-8 h-8 text-white transition-all duration-300 ease-in-out" />
            </div>
            <h2
              className={`text-3xl font-bold transition-all duration-300 ease-in-out ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Log In!
            </h2>
            <p
              className={`mt-2 transition-all duration-300 ease-in-out ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Discover new possibilities
            </p>
          </div>

          {error && (
            <div
              className={`p-3 rounded-lg mb-4 transition-all duration-300 ease-in-out ${
                darkMode
                  ? "bg-red-900/20 border border-red-800/30 text-red-300"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                className={`block text-sm font-medium mb-2 transition-all duration-300 ease-in-out ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Username
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ease-in-out ${
                    darkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:scale-[1.02] ${
                    darkMode
                      ? "bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-700/80"
                      : "bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500/50 focus:border-transparent focus:bg-white"
                  }`}
                  placeholder="Username"
                  value={registerData.username}
                  onChange={(e) => {
                    setRegisterData({ ...registerData, username: e.target.value });
                    setError("");
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 transition-all duration-300 ease-in-out ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ease-in-out ${
                    darkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full pl-10 pr-12 py-3 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:scale-[1.02] ${
                    darkMode
                      ? "bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-700/80"
                      : "bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500/50 focus:border-transparent focus:bg-white"
                  }`}
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <button
                  type="button"
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 ease-in-out hover:scale-110 ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                darkMode
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              }`}
              onClick={handleSubmit}
            >
              Log In
            </button>

            <button
              type="button"
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                darkMode
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40"
                  : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40"
              }`}
              onClick={handleDemoLogin}
            >
              Use Demo Account
            </button>
          </div>

          <div className="mt-6 text-center space-y-3">
            <p
              className={`transition-all duration-300 ease-in-out ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Don't have an account yet?{" "}
              <NavLink to="/signup" end>
                <button
                  className={`text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                    darkMode
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md shadow-blue-500/25"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-md shadow-purple-500/25"
                  }`}
                >
                  Sign Up
                </button>
              </NavLink>
            </p>
            <NavLink to="/homepage" end>
              <button
                className={`text-sm px-4 py-2 mt-2 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                  darkMode
                    ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-md shadow-gray-500/25"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white shadow-md shadow-gray-500/25"
                }`}
              >
                Go back to homepage
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </LoadingWrapper>
  );
}
