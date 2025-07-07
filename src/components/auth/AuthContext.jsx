import { apiUrl, getFilters } from "../../utils/index.js";
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();
export default AuthContext;

export function AuthProvider({ children }) {
  const [darkMode, setDarkMode] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDarkMode(saved === "light" ? false : true);
  }, []);

  useEffect(() => {
    if (darkMode !== null) {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
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

  const [avatarUrl, setAvatarUrl] = useState(null);

  const loginUser = async (userData) => {
    setUser(userData.user);

    if (userData.avatarUrl) {
      const cachedAvatar = getCachedAvatar(userData.id);
      if (cachedAvatar) {
        setAvatarUrl(cachedAvatar);
      } else {
        const avatarBlob = await fetchAndCacheAvatar(userData.avatarUrl, userData.id);
        setAvatarUrl(avatarBlob);
      }
    }
  };
  const [loading, setLoading] = useState(true);

  console.log("To jest moj user: ", user);
  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      return;
    }
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

        // check cache if user has avatarUrl
        if (data.data.avatarUrl) {
          const cachedAvatar = getCachedAvatar(data.data.id);
          if (cachedAvatar) {
            setAvatarUrl(cachedAvatar);
          } else {
            // download and cache
            const avatarBlob = await fetchAndCacheAvatar(data.data.avatarUrl, data.data.id);
            setAvatarUrl(avatarBlob);
          }
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

  const getCachedAvatar = (userId) => {
    const cached = localStorage.getItem(`avatar_${userId}`);
    const timestamp = localStorage.getItem(`avatar_${userId}_timestamp`);

    if (cached && timestamp) {
      const cacheAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24h
      if (cacheAge < maxAge) {
        return cached;
      } else {
        // delete old cache
        localStorage.removeItem(`avatar_${userId}`);
        localStorage.removeItem(`avatar_${userId}_timestamp`);
      }
    }
    return null;
  };

  const fetchAndCacheAvatar = async (avatarUrl, userId) => {
    try {
      const response = await fetch(avatarUrl);
      // Check response
      if (!response.ok) {
        console.error("Avatar fetch failed:", response.status, response.statusText);
        return null;
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        console.error("Response is not an image:", contentType);
        return null;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Cache in local storage (base64)
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem(`avatar_${userId}`, reader.result);
        localStorage.setItem(`avatar_${userId}_timestamp`, Date.now().toString());
      };
      reader.readAsDataURL(blob);

      return objectUrl;
    } catch (error) {
      console.error("Avatar fetch error:", error);
      return null;
    }
  };

  const updateAvatar = async (newAvatarUrl) => {
    // delete old cache
    localStorage.removeItem(`avatar_${user.id}`);
    localStorage.removeItem(`avatar_${user.id}_timestamp`);

    // download new avatar
    const avatarBlob = await fetchAndCacheAvatar(newAvatarUrl, user.id);
    setAvatarUrl(avatarBlob);
  };

  useEffect(() => {
    // Fetch labels for ideas when user is logged in
    const fetchLabels = async () => {
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
    <AuthContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        user,
        loginUser,
        loading,
        labels,
        updateAvatar,
        avatarUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
