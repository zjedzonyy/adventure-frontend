/* eslint-disable no-undef */
import { apiUrl, getFilters } from "../../utils/index.js";
import { createContext, useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";

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
    _statusTypes: [],
    get statusTypes() {
      return this._statusTypes;
    },
    set statusTypes(value) {
      this._statusTypes = value;
    },
  });
  const [labelsLoading, setLabelsLoading] = useState(false);

  // Use notificiation in every page
  const showToast = ({ severity, detail }) => {
    if (severity === "success") {
      toast.success(detail);
    } else if (severity === "error") {
      toast.error(detail);
    }
  };

  // Refs to prevent multiple requests
  const authFetchRef = useRef(false);
  const labelsFetchRef = useRef(false);

  // DEBUG: Console log every state change
  // useEffect(() => {
  //   console.log("AUTH STATE CHANGE:", {
  //     user: user ? { id: user.id, username: user.username } : null,
  //     loading,
  //     avatarUrl: avatarUrl ? "present" : "null",
  //     timestamp: new Date().toISOString(),
  //   });
  // }, [user, loading, avatarUrl]);

  // Theme management
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
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
  const getCachedAvatar = useCallback(userId => {
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
      const urlWithTimestamp = `${avatarUrl}?t=${Date.now()}`; // Prevent caching issues
      const response = await fetch(urlWithTimestamp);

      if (!response.ok) {
        console.error("Avatar fetch failed:", response.status, response.statusText);
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        console.error("Response is not an image:", contentType);
        return null;
      }

      // Convert response to Base64 to avoid memory leaks
      // It's more robust to store as Base64 in localStorage
      const blob = await response.blob();
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          localStorage.setItem(`avatar_${userId}`, base64String);
          localStorage.setItem(`avatar_${userId}_timestamp`, Date.now().toString());

          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });

      // if (blob.type && !blob.type.startsWith("image/")) {
      //   console.error("Blob is not an image:", blob.type);
      //   return null;
      // }

      // const objectUrl = URL.createObjectURL(blob);

      // // Cache in localStorage
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   localStorage.setItem(`avatar_${userId}`, reader.result);
      //   localStorage.setItem(`avatar_${userId}_timestamp`, Date.now().toString());
      // };
      // reader.readAsDataURL(blob);

      // return objectUrl;
    } catch (error) {
      console.error("Avatar fetch error:", error);
      return null;
    } finally {
      setAvatarLoading(false);
    }
  }, []);

  const clearAvatar = useCallback(() => {
    if (!user?.id) return;

    // Clear cache
    localStorage.removeItem(`avatar_${user.id}`);
    localStorage.removeItem(`avatar_${user.id}_timestamp`);

    // Clear state
    setAvatarUrl(null);

    // Clean up any existing object URLs to prevent memory leaks
    if (avatarUrl && avatarUrl.startsWith("blob:")) {
      URL.revokeObjectURL(avatarUrl);
    }
  }, [user?.id, avatarUrl]);

  const loadAvatar = useCallback(
    async userData => {
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
    async newAvatarUrl => {
      if (!user?.id) return;

      // Clear old cache
      localStorage.removeItem(`avatar_${user.id}`);
      localStorage.removeItem(`avatar_${user.id}_timestamp`);

      if (!newAvatarUrl) {
        setAvatarUrl(null);
        return;
      }

      try {
        const base64Avatar = await fetchAndCacheAvatar(newAvatarUrl, user.id);
        if (base64Avatar) {
          setAvatarUrl(base64Avatar);
          setUser(prev => ({ ...prev, avatarUrl: newAvatarUrl }));

          const updatedUser = { ...user, avatarUrl: newAvatarUrl };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          console.error("Failed to update avatar, no valid base64 returned");
          setAvatarUrl(null);
        }
      } catch (error) {
        console.error("Error updating avatar:", error);
        setAvatarUrl(null);
      }
    },
    [user, fetchAndCacheAvatar]
  );

  const loginUser = useCallback(
    async userData => {
      try {
        if (!userData) {
          setUser(null);
          setAvatarUrl(null);
          localStorage.removeItem("user");
          return;
        }
        // Set user state FIRST
        setUser(userData);

        // Save to localStorage immediately
        localStorage.setItem("user", JSON.stringify(userData));

        // Verify what's actually in localStorage
        // const savedCheck = localStorage.getItem("user");

        // Load avatar in background (don't wait for it)
        loadAvatar(userData).catch(err => {
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
      return;
    }

    try {
      authFetchRef.current = true;
      setLoading(true);
      setAuthError(null);

      const res = await fetch(`${apiUrl}/users/me`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success && data.data) {
        setUser(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));

        // Load avatar in background
        loadAvatar(data.data).catch(err => {
          console.error("Avatar loading failed:", err);
        });
      } else {
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
      // Check localStorage first
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setLoading(false);

          // Load avatar in background
          loadAvatar(userData).catch(err => {
            console.error("Avatar loading failed:", err);
          });
        } catch (error) {
          console.error("Failed to parse saved user:", error);
          localStorage.removeItem("user");
          await fetchUserProfile();
        }
      } else {
        await fetchUserProfile();
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    clearAvatar,

    // Labels
    labels,
    labelsLoading,
    fetchLabels,

    showToast,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
