import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { AuthContext } from "../auth/index.js";
import { UserSearchBar } from "../common/index.js";

import { Compass, User, Sun, Moon, Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, user, logout, avatarUrl, avatarLoading } =
    useContext(AuthContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-dark_background shadow-sm border-b border-background dark:border-dark_background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-6 h-6 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
              <Compass className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-sm sm:text-2xl font-bold text-text_secondary dark:text-text_primary">
              <NavLink to="/homepage">AdVenture</NavLink>
            </h1>
          </div>

          {/* Desktop nav links + search */}
          <nav className="hidden lg:flex items-center space-x-8 ml-8 flex-1">
            <div className="flex space-x-6">
              <NavLink
                to="/ideas/search"
                className="text-gray-700 hover:text-purple-600 font-medium dark:text-text_primary dark:hover:text-purple-400 hover:brightness-110 transition duration-200"
              >
                Discover
              </NavLink>
              <NavLink
                to="/add-idea"
                className="text-gray-700 hover:text-purple-600 font-medium dark:text-text_primary dark:hover:text-purple-400 hover:brightness-110 transition duration-200"
              >
                Add
              </NavLink>
            </div>
            <div className="ml-8 max-w-md w-full">
              <UserSearchBar />
            </div>
          </nav>

          {/* Desktop user avatar */}
          <div className="hidden lg:block relative ml-4">
            <details className="group">
              <summary className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition list-none flex items-center">
                {avatarLoading ? (
                  <div className="w-11 h-11 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                ) : avatarUrl ? (
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

          {/* Mobile hamburger and avatar */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
              )}
            </button>

            {/* Avatar */}
            <details className="group">
              <summary className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition list-none flex items-center">
                {avatarLoading ? (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                ) : avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-700 dark:text-white" />
                )}
              </summary>
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50">
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

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-2 space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
            <UserSearchBar />
            <NavLink
              to="/ideas/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Discover
            </NavLink>
            <NavLink
              to="/add-idea"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Add
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
