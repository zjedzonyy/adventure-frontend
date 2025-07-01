import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
      // If all validations pass, proceed with form submission
      console.log("Form submitted successfully", registerData);
      console.log("Error State:", error);
      e.preventDefault();
      try {
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData),
          credentials: "include",
        });
        const data = await res.json();
        if (data.name) {
          setError(data.message);
        } else {
          // Handle successful demo login
          loginUser(data.user);
          window.location.href = "/homepage"; // Redirect to homepage after demo login
        }
      } catch (error) {
        console.error(error);
        console.log("Error during registration");
      }
    } else {
      setError("Please fill in all fields correctly:");
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
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
        loginUser(data.user);
        window.location.href = "/homepage"; // Redirect to homepage after demo login
      }
    } catch (error) {
      console.error(error);
      console.log("Error during demo login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center">
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 z-10"
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-600" />
        )}
      </button>
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-4 w-full max-w-md">
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Log In!</h2>
          <p className="text-gray-600 mt-2">Discover new possibilities</p>
        </div>
        <p className="font-medium text-sm text-red-500">{error}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>

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
                  setError("");
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Password"
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

          <button
            type="submit"
            className="w-full border-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-purple-700  text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105  "
            onClick={handleSubmit}
          >
            Log In
          </button>
          <button
            type="button"
            className="w-full border-0 bg-gradient-to-r from-yellow-400 to-orange-500 hover:bg-yellow-400  text-black py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            onClick={handleDemoLogin}
          >
            Use Demo Account
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account yet?{" "}
            <NavLink to="/signup" end>
              <button className="text-sm border-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-purple-700 font-semibold transition-all duration-200 transform hover:scale-105">
                Sign Up
              </button>
            </NavLink>
          </p>
          <NavLink to="/homepage" end>
            <button
              onClick={() => setCurrentView("home")}
              className="text-sm m-2 border-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-purple-700 font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Go back to homepage
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
