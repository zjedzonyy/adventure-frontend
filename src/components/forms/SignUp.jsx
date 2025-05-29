import React, { useState, useEffect } from "react";
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
} from "lucide-react";

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
      console.log("Form submitted successfully", registerData);
      console.log("Confirm Password:", confirmPassword);
      console.log("Show Password:", showPassword);
      console.log("Error State:", error);
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
        console.log(data);
      } catch (error) {
        console.error(error);
        console.log("Error during registration");
      }
    } else {
      setError({
        ...error,
        sendData: "Please fill in all fields correctly:",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-4 w-full max-w-md">
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Join us!</h2>
          <p className="text-gray-600 mt-2">Fuel your curiosity</p>
        </div>
        <p className="font-medium text-sm text-red-500">{error.sendData}</p>
        <p className="font-medium text-sm text-red-500">
          {backendData.message ? backendData.message : ""}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <p className="font-medium text-sm text-red-500">{error.username}</p>

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <p className="font-medium text-sm text-red-500">{error.email}</p>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <p className="font-medium text-sm text-red-500">{error.password}</p>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
            <p className="font-medium text-sm text-red-500">{error.confirmPassword}</p>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                ${error.confirmPassword ? "border-2 border-red-400/100" : "border-gray-300"}`}
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
            className="w-full border-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-purple-700  text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105  "
            onClick={handleSubmit}
          >
            Sign Up
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have account?{" "}
            <button
              onClick={() => setCurrentView("login")}
              className="text-sm border-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-purple-700 font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Log In
            </button>
          </p>
          <button
            onClick={() => setCurrentView("home")}
            className="text-sm m-2 border-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-purple-700 font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Go back to homepage
          </button>
        </div>
      </div>
    </div>
  );
}
