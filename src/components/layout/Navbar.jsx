import { NavLink } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../auth/index.js";
import { UserSearchBar } from "../common/index.js";
import { apiUrl } from "../../utils/index.js";

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
  Settings,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { darkMode, toggleDarkMode, user, loginUser } = useContext(AuthContext);

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
        // Clear user data and redirect to login page
        loginUser(null);
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect to login page
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  return (
    <header className="bg-white dark:bg-dark_background shadow-sm border-b border-background dark:border-dark_background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text_secondary dark:text-text_primary">
              <a href="/homepage">AdVenture</a>
            </h1>
          </div>

          {/* Search Bar for larger screens */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <UserSearchBar />
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <a
                href="/ideas/search"
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
          {/* Dropdown for mobile */}
          <div className="lg:hidden relative">
            <details className="group">
              <summary className="cursor-pointer text-gray-700 dark:text-text_primary font-medium py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Menu
              </summary>
              <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg">
                {/* Search Bar for mobile */}
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
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Community
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  My Ideas
                </a>
              </div>
            </details>
          </div>

          <div className="hidden md:flex items-center space-x-4">
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
                <NavLink to={`/profile/${user.id}`}>
                  <button
                    className="bg-primary dark:bg-dark_primary text-text_primary px-4 py-2 rounded-lg  
                hover:bg-secondary hover:brightness-115 transition-all duration-300 ease-in-out delay-100
                dark:hover:bg-dark_secondary dark:hover:brightness-125 dark:transition-all dark:duration-300 dark:ease-in-out dark:delay-100
                "
                  >
                    <User className="w-6 h-6"></User>
                  </button>
                </NavLink>
                <NavLink to="/settings">
                  <button
                    className="bg-primary dark:bg-dark_primary text-text_primary px-4 py-2 rounded-lg  
                hover:bg-secondary hover:brightness-115 transition-all duration-300 ease-in-out delay-100
                dark:hover:bg-dark_secondary dark:hover:brightness-125 dark:transition-all dark:duration-300 dark:ease-in-out dark:delay-100
                "
                  >
                    <Settings className="w-6 h-6"></Settings>
                  </button>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-primary dark:bg-dark_primary text-text_primary px-4 py-2 rounded-lg  
                hover:bg-secondary hover:brightness-115 transition-all duration-300 ease-in-out delay-100
                dark:hover:bg-dark_secondary dark:hover:brightness-125 dark:transition-all dark:duration-300 dark:ease-in-out dark:delay-100
                "
                >
                  <LogOut className="w-6 h-6"></LogOut>
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
          {/* Dropdown for mobiles */}
          <div className="md:hidden">
            <details className="group">
              <summary className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition list-none">
                {" "}
                <User className="w-6 h-6 text-gray-700 dark:text-white" />
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50">
                {/* Dark mode toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>

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
