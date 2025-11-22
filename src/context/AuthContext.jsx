import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Use correct Vite env variable
const API_URL = import.meta.env.VITE_API_URL;
console.log("🔧 Using API URL:", API_URL);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //-----------------------------
  // Storage helpers
  //-----------------------------
  const getToken = () =>
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");

  const setToken = (token) => {
    sessionStorage.setItem("token", token);
    localStorage.setItem("token", token);
  };

  const clearAuthData = () => {
    ["token", "access_token", "refresh_token", "user"].forEach((key) => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });
  };

  const getUserData = () =>
    sessionStorage.getItem("user") || localStorage.getItem("user");

  const setUserData = (data) => {
    sessionStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("user", JSON.stringify(data));
  };

  //-----------------------------
  // Refresh user profile
  //-----------------------------
  const refreshUser = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) logout();
        return null;
      }

      const data = await res.json();
      setUserData(data);
      setUser(data);
      return data;
    } catch (err) {
      console.error("Error refreshing user:", err);
    }
  };

  //-----------------------------
  // Refresh token
  //-----------------------------
  const refreshToken = async () => {
    try {
      let refresh =
        sessionStorage.getItem("refresh_token") ||
        localStorage.getItem("refresh_token");

      if (!refresh) throw new Error("No refresh token found");

      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      });

      if (!res.ok) throw new Error("Token refresh failed");

      const data = await res.json();

      setToken(data.access_token);

      if (data.refresh_token) {
        sessionStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      return data.access_token;
    } catch (err) {
      logout();
    }
  };

  //-----------------------------
  // LOGIN
  //-----------------------------
  const login = async (email, password) => {
    try {
      clearAuthData();

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Invalid credentials");
      }

      const data = await res.json();
      setToken(data.access_token);

      if (data.refresh_token) {
        sessionStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      // load profile
      const profileRes = await fetch(`${API_URL}/profile/`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      const profile = profileRes.ok
        ? await profileRes.json()
        : { email, full_name: email.split("@")[0] };

      setUserData(profile);
      setUser(profile);

      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      clearAuthData();
      setIsAuthenticated(false);
      throw err;
    }
  };

  //-----------------------------
  // LOGOUT
  //-----------------------------
  const logout = () => {
    clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
  };

  //-----------------------------
  // On load: check saved session
  //-----------------------------
  useEffect(() => {
    const token = getToken();
    const userData = getUserData();

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      clearAuthData();
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        refreshToken,
        refreshUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
