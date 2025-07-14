import { apiUrl, getFilters } from "../../utils/index.js";
import { createContext, useState, useEffect, useCallback, useRef } from "react";

const AuthContext = createContext();
export default AuthContext;

export function AuthProvider({ children }) {
  // Theme state
  const [darkMode, setDarkMode] = useState(null);

  // Auth state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Labels state
  const [labels, setLabels] = useState({
    categories: [],
    durations: [],
    priceRanges: [],
    groups: [],
    locationTypes: [],
    statusTypes: [],
  });
  const [labelsLoading, setLabelsLoading] = useState(false);

  // Refs to prevent multiple requests
  const authFetchRef = useRef(false);
  const labelsFetchRef = useRef(false);

  // DEBUG: Console log every state change
  useEffect(() => {
    console.log("AUTH STATE CHANGE:", {
      user: user ? { id: user.id, username: user.username } : null,
      loading,
      avatarUrl: avatarUrl ? "present" : "null",
      timestamp: new Date().toISOString(),
    });
  }, [user, loading, avatarUrl]);

  // Theme management
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  }, []);

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDarkMode(saved === "light" ? false : true);
  }, []);

  // Update document class when theme changes
  useEffect(() => {
    if (darkMode !== null) {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  // Avatar management
  const getCachedAvatar = useCallback((userId) => {
    const cached = localStorage.getItem(`avatar_${userId}`);
    const timestamp = localStorage.getItem(`avatar_${userId}_timestamp`);

    if (cached && timestamp) {
      const cacheAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24h
      if (cacheAge < maxAge) {
        return cached;
      } else {
        localStorage.removeItem(`avatar_${userId}`);
        localStorage.removeItem(`avatar_${userId}_timestamp`);
      }
    }
    return null;
  }, []);

  const fetchAndCacheAvatar = useCallback(async (avatarUrl, userId) => {
    try {
      setAvatarLoading(true);
      const response = await fetch(avatarUrl);

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

      // Cache in localStorage
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
    } finally {
      setAvatarLoading(false);
    }
  }, []);

  const loadAvatar = useCallback(
    async (userData) => {
      if (!userData?.avatarUrl) {
        return;
      }

      const cachedAvatar = getCachedAvatar(userData.id);
      if (cachedAvatar) {
        setAvatarUrl(cachedAvatar);
      } else {
        const avatarBlob = await fetchAndCacheAvatar(userData.avatarUrl, userData.id);
        if (avatarBlob) {
          setAvatarUrl(avatarBlob);
        }
      }
    },
    [getCachedAvatar, fetchAndCacheAvatar]
  );

  const updateAvatar = useCallback(
    async (newAvatarUrl) => {
      if (!user?.id) return;

      // Clear old cache
      localStorage.removeItem(`avatar_${user.id}`);
      localStorage.removeItem(`avatar_${user.id}_timestamp`);

      // Load new avatar
      const avatarBlob = await fetchAndCacheAvatar(newAvatarUrl, user.id);
      if (avatarBlob) {
        setAvatarUrl(avatarBlob);
      }
    },
    [user?.id, fetchAndCacheAvatar]
  );

  const loginUser = useCallback(
    async (userData) => {
      try {
        console.log("loginUser called with:", userData);

        if (!userData) {
          console.log("No userData provided, clearing user");
          setUser(null);
          setAvatarUrl(null);
          localStorage.removeItem("user");
          return;
        }
        console.log("✅ Setting user immediately:", userData);
        // Set user state FIRST
        setUser(userData);

        // Save to localStorage immediately
        localStorage.setItem("user", JSON.stringify(userData));

        console.log(" User set in state and localStorage");

        // Verify what's actually in localStorage
        const savedCheck = localStorage.getItem("user");
        console.log(
          " Verification - localStorage contains:",
          savedCheck ? JSON.parse(savedCheck) : "null"
        );

        // Load avatar in background (don't wait for it)
        loadAvatar(userData).catch((err) => {
          console.error("Avatar loading failed:", err);
        });
      } catch (error) {
        console.error(" Login error:", error);
        setAuthError("Failed to login");
      }
    },
    [loadAvatar]
  );
  const fetchUserProfile = useCallback(async () => {
    if (authFetchRef.current) {
      console.log("Auth fetch already in progress, skipping...");
      return;
    }

    try {
      authFetchRef.current = true;
      setLoading(true);
      setAuthError(null);

      console.log("Fetching user profile from:", `${apiUrl}/users/me`);

      const res = await fetch(`${apiUrl}/users/me`, {
        method: "GET",
        credentials: "include",
      });
      console.log(" Fetch response status:", res.status);
      console.log("Fetch response headers:", Object.fromEntries(res.headers.entries()));

      const data = await res.json();
      console.log(" Fetch response data:", data);

      if (data.success && data.data) {
        console.log("Setting user from fetch:", data.data);
        setUser(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));

        // Load avatar in background
        loadAvatar(data.data).catch((err) => {
          console.error("Avatar loading failed:", err);
        });
      } else {
        console.log("No user data in response, clearing state");
        setUser(null);
        setAvatarUrl(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setAuthError("Failed to fetch user profile");
      setUser(null);
      setAvatarUrl(null);
      localStorage.removeItem("user");
    } finally {
      console.log("Fetch complete, setting loading to false");
      setLoading(false);
      authFetchRef.current = false;
    }
  }, [loadAvatar]);

  // Labels management
  const fetchLabels = useCallback(async () => {
    if (labelsFetchRef.current) return;

    try {
      labelsFetchRef.current = true;
      setLabelsLoading(true);

      const filters = await getFilters();
      setLabels(filters);
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    } finally {
      setLabelsLoading(false);
      labelsFetchRef.current = false;
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔍 Initializing auth...");

      // Check localStorage first
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log("Found user in localStorage:", userData);
          setUser(userData);
          setLoading(false);

          // Load avatar in background
          loadAvatar(userData).catch((err) => {
            console.error("Avatar loading failed:", err);
          });
        } catch (error) {
          console.error("Failed to parse saved user:", error);
          localStorage.removeItem("user");
          await fetchUserProfile();
        }
      } else {
        console.log("No user in localStorage, fetching from server...");
        await fetchUserProfile();
      }
    };

    initializeAuth();
  }, []);

  // Load labels on mount
  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setUser(null);
        setAvatarUrl(null);
        localStorage.removeItem("user");

        // Clear avatar cache
        if (user?.id) {
          localStorage.removeItem(`avatar_${user.id}`);
          localStorage.removeItem(`avatar_${user.id}_timestamp`);
        }
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }, [user?.id]);

  const contextValue = {
    // Theme
    darkMode,
    toggleDarkMode,

    // Auth
    user,
    loading,
    authError,
    loginUser,
    logout,

    // Avatar
    avatarUrl,
    avatarLoading,
    updateAvatar,

    // Labels
    labels,
    labelsLoading,
    fetchLabels,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
