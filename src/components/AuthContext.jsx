import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api.js";
import { getFilters } from "../utils/getFilters.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const [user, setUser] = useState(null);
  const [labels, setLabels] = useState({
    categories: [],
    durations: [],
    priceRanges: [],
    groups: [],
    locationTypes: [],
    statusTypes: [],
  });

  const loginUser = (userData) => {
    setUser(userData);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("user");

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
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Fetch labels for ideas when user is logged in
    const fetchLabels = async () => {
      console;
      try {
        const filters = await getFilters();
        setLabels(filters);
      } catch (error) {
        console.error("Failed to fetch labels:", error);
      }
    };
    fetchLabels();
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
    <AuthContext.Provider value={{ darkMode, toggleDarkMode, user, loginUser, loading, labels }}>
      {children}
    </AuthContext.Provider>
  );
}
