import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../auth/index.js";
import { UserSearchBar } from "../common/index.js";
import { apiUrl } from "../../utils/index.js";

import { Compass, User, Sun, Moon } from "lucide-react";

export default function Navbar() {
  // Destructure context for auth and theme
  const { darkMode, toggleDarkMode, user, loginUser, avatarUrl } = useContext(AuthContext);

  // Handles user logout
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        loginUser(null);
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-dark_background shadow-sm border-b border-background dark:border-dark_background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text_secondary dark:text-text_primary">
              <a href="/homepage">AdVenture</a>
            </h1>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden lg:flex items-center space-x-8 ml-8">
            <nav className="flex space-x-6">
              <a
                href="/ideas/search"
                className="text-gray-700 hover:text-purple-600 font-medium dark:text-text_primary dark:hover:text-purple-400 hover:brightness-115 transition-all duration-200 ease-in-out delay-100"
              >
                Discover
              </a>
              <a
                href="/add-idea"
                className="text-gray-700 hover:text-purple-600 font-medium dark:text-text_primary dark:hover:text-purple-400 hover:brightness-115 transition-all duration-200 ease-in-out delay-100"
              >
                Add
              </a>
            </nav>
          </div>

          {/* Mobile menu dropdown */}
          <div className="lg:hidden relative ml-4">
            <details className="group">
              <summary className="cursor-pointer text-gray-700 dark:text-text_primary font-medium py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Menu
              </summary>
              <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg">
                {/* Mobile search bar */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 md:hidden">
                  <UserSearchBar />
                </div>
                <a
                  href="/ideas/search"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Discover
                </a>
                <a
                  href="/add-idea"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Add
                </a>
              </div>
            </details>
          </div>

          {/* Desktop search bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <UserSearchBar />
          </div>

          {/* User avatar and dropdown (mobile & desktop) */}
          <div className="">
            <details className="group">
              <summary className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition list-none">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-700 dark:text-white" />
                )}
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50">
                {/* Theme toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {!darkMode ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  Change theme
                </button>
                {/* Authenticated user options */}
                {user ? (
                  <>
                    <NavLink
                      to={`/profile/${user.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign In
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Join
                    </NavLink>
                  </>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
