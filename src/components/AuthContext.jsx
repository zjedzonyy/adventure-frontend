import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const [user, setUser] = useState(null);

  const loginUser = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    // Fetch user profile on component mount
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${apiUrl}/users/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUser(null);
      }
    };
    fetchUserProfile();
  }, []);

  // Change the document's class based on darkMode state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, [darkMode]);

  return (
    <AuthContext.Provider value={{ darkMode, toggleDarkMode, user, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
}
