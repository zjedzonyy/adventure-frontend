import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { apiUrl } from "../utils/api.js";

import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
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
  Drama,
  Sun,
  Moon,
} from "lucide-react";

export default function Sidebar() {
  const { darkMode, toggleDarkMode, user, loginUser } = useContext(AuthContext);

  //   const handleLogout = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const res = await fetch(`${apiUrl}/auth/logout`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //       });
  //       const data = await res.json();
  //       if (data.success) {
  //         // Clear user data and redirect to login page
  //         loginUser(null);
  //         window.location.href = "/login"; // Redirect to login page
  //       }
  //     } catch (error) {
  //       console.error("Failed to log out:", error);
  //     }
  //   };

  return (
    <header className="bg-white dark:bg-dark_background shadow-sm border-b border-background dark:border-dark_background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text_secondary dark:text-text_primary">
              AdVenture
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <a
                href="#"
                className="text-gray-700 hover:text-purple-600 font-medium dark:text-text_primary dark:hover:text-purple-400 hover:brightness-115 transition-all duration-200 ease-in-out delay-100"
              >
                Discover
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-purple-600 font-medium dark:text-text_primary dark:hover:text-purple-400 hover:brightness-115 transition-all duration-200 ease-in-out delay-100"
              >
                Community
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-purple-600 font-medium dark:text-text_primary dark:hover:text-purple-400 hover:brightness-115 transition-all duration-200 ease-in-out delay-100"
              >
                My Ideas
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-dark_background dark:hover:bg-background transition-colors duration-200"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
            {user ? (
              <>
                <NavLink to="/me">
                  <button
                    className="bg-primary dark:bg-dark_primary text-text_primary px-4 py-2 rounded-lg  
                hover:bg-secondary hover:brightness-115 transition-all duration-300 ease-in-out delay-100
                dark:hover:bg-dark_secondary dark:hover:brightness-125 dark:transition-all dark:duration-300 dark:ease-in-out dark:delay-100
                "
                  >
                    <User className="w-6 h-6"></User>
                  </button>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-primary dark:bg-dark_primary text-text_primary px-4 py-2 rounded-lg  
                hover:bg-secondary hover:brightness-115 transition-all duration-300 ease-in-out delay-100
                dark:hover:bg-dark_secondary dark:hover:brightness-125 dark:transition-all dark:duration-300 dark:ease-in-out dark:delay-100
                "
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <button
                    className="bg-primary dark:bg-dark_primary text-text_primary px-4 py-2 rounded-lg  
                hover:bg-secondary hover:brightness-115 transition-all duration-300 ease-in-out delay-100
                dark:hover:bg-dark_secondary dark:hover:brightness-125 dark:transition-all dark:duration-300 dark:ease-in-out dark:delay-100
                "
                  >
                    Sign In
                  </button>
                </NavLink>
                <NavLink to="/signup">
                  <button
                    className="bg-primary dark:bg-dark_primary text-text_primary px-4 py-2 rounded-lg  
                hover:bg-secondary hover:brightness-115 transition-all duration-300 ease-in-out delay-100
                dark:hover:bg-dark_secondary dark:hover:brightness-125 dark:transition-all dark:duration-300 dark:ease-in-out dark:delay-100
                "
                  >
                    Join
                  </button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
