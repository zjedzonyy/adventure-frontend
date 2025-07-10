import React, { useState, useEffect } from "react";
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
import { AuthContext } from "../auth/index.js";

export default function SignUp() {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [backendData, setBackendData] = useState({});

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    sendData: "",
  });

  const { darkMode, toggleDarkMode } = React.useContext(AuthContext);

  // If registerData.password and confirmPassword are not empty and do not match, show an error message
  const validateConfirmPassword = (password, confirm) => {
    if (password && confirm) {
      if (password !== confirm) {
        setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
        return false;
      } else {
        setError((prev) => ({ ...prev, confirmPassword: "" }));
        return true;
      }
    }
    return true;
  };

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (registerData.email && !emailPattern.test(registerData.email)) {
      setError({ ...error, email: "Invalid email format" });
      return false;
    }
    setError({ ...error, email: "" });
    return true;
  };

  const validatePassword = (password, confirm) => {
    validateConfirmPassword(password, confirm);
    if (registerData.password.length < 8) {
      setError({ ...error, password: "Password must be at least 8 characters" });
      return false;
    } else if (!/[A-Z]/.test(registerData.password)) {
      setError({ ...error, password: "Password must contain at least one uppercase letter" });
      return false;
    } else if (!/[0-9]/.test(registerData.password)) {
      setError({ ...error, password: "Password must contain at least one number" });
      return false;
    }
    setError({ ...error, password: "" });
    return true;
  };

  const handleSubmit = async (e) => {
    if (validateEmail() && validatePassword() && validateConfirmPassword()) {
      // If all validations pass, proceed with form submission
      e.preventDefault();
      try {
        const res = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData),
        });
        const data = await res.json();
        if (data.field && data.message) {
          // If the response contains a field and message, set the error state
          setError((prev) => {
            const newError = {
              ...prev,
              sendData: "",
              [data.field]: data.message,
            };
            return newError;
          });
        }
        if (!data.field && data.name) {
          setBackendData(data);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setError({
        ...error,
        sendData: "Please fill in all fields correctly:",
      });
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-in-out flex items-center justify-center p-4 relative ${
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
            <User className="w-8 h-8 text-white transition-all duration-300 ease-in-out" />
          </div>

          <h2
            className={`text-3xl font-bold transition-all duration-300 ease-in-out ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Join us!
          </h2>
          <p
            className={`mt-2 transition-all duration-300 ease-in-out ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Fuel your curiosity
          </p>
        </div>

        {(error.sendData || backendData.message) && (
          <div
            className={`p-3 rounded-lg mb-4 transition-all duration-300 ease-in-out ${
              darkMode
                ? "bg-red-900/20 border border-red-800/30 text-red-300"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">{error.sendData || backendData.message}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-all duration-300 ease-in-out ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Username
            </label>
            {error.username && (
              <div
                className={`p-2 rounded-md mb-2 transition-all duration-300 ease-in-out ${
                  darkMode
                    ? "bg-red-900/20 border border-red-800/30 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                <span className="font-medium text-sm">{error.username}</span>
              </div>
            )}

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
                  setError({ ...error, username: "" });
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
              Email
            </label>
            {error.email && (
              <div
                className={`p-2 rounded-md mb-2 transition-all duration-300 ease-in-out ${
                  darkMode
                    ? "bg-red-900/20 border border-red-800/30 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                <span className="font-medium text-sm">{error.email}</span>
              </div>
            )}

            <div className="relative">
              <Mail
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ease-in-out ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
              <input
                type="email"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:scale-[1.02] ${
                  darkMode
                    ? "bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-700/80"
                    : "bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500/50 focus:border-transparent focus:bg-white"
                }`}
                placeholder="user@gmail.com"
                value={registerData.email}
                onChange={(e) => {
                  setRegisterData({ ...registerData, email: e.target.value });
                  validateEmail();
                  setError({ ...error, email: "" });
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
            {error.password && (
              <div
                className={`p-2 rounded-md mb-2 transition-all duration-300 ease-in-out ${
                  darkMode
                    ? "bg-red-900/20 border border-red-800/30 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                <span className="font-medium text-sm">{error.password}</span>
              </div>
            )}
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
                placeholder="minimum 8 characters"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                onBlur={(e) => {
                  const value = e.target.value;
                  validateConfirmPassword(value, confirmPassword);
                }}
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

          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-all duration-300 ease-in-out ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Confirm password
            </label>
            {error.confirmPassword && (
              <div
                className={`p-2 rounded-md mb-2 transition-all duration-300 ease-in-out ${
                  darkMode
                    ? "bg-red-900/20 border border-red-800/30 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                <span className="font-medium text-sm">{error.confirmPassword}</span>
              </div>
            )}

            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ease-in-out ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
              <input
                type="password"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:scale-[1.02] ${
                  error.confirmPassword
                    ? darkMode
                      ? "bg-gray-700/50 border-2 border-red-500/50 text-white placeholder-gray-400 focus:ring-red-500/50 focus:border-red-500/50"
                      : "bg-white/80 border-2 border-red-400 text-gray-900 placeholder-gray-500 focus:ring-red-500/50 focus:border-red-400"
                    : darkMode
                      ? "bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-700/80"
                      : "bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500/50 focus:border-transparent focus:bg-white"
                }`}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                onBlur={(e) => validateConfirmPassword(registerData.password, e.target.value)}
              />
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
            Sign Up
          </button>
        </div>

        <div className="mt-6 text-center space-y-3">
          <p
            className={`transition-all duration-300 ease-in-out ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Already have account?{" "}
            <NavLink to="/login" end>
              <button
                className={`text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                  darkMode
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md shadow-blue-500/25"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-md shadow-purple-500/25"
                }`}
              >
                Log In
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
  );
}
