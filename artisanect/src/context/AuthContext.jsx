import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest } from "../services/api.js";

const AuthContext = createContext(undefined);
const STORAGE_KEY = "artisanect-auth";

/**
 * AuthProvider
 * Demo role-based auth (no real passwords/sessions yet). Holds the
 * current role ("customer" | "crafter" | null) and profile, persisted to
 * localStorage so a refresh doesn't log the user out.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  /** Logs in as the given role ("customer" | "crafter") via the dummy auth API. */
  async function loginAs(role) {
    const profile = await loginRequest(role);
    setUser(profile);
    return profile;
  }

  /** Clears the current session. */
  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth
 * Hook for accessing the current user/role and auth actions.
 * @returns {{ user: object|null, role: "customer"|"crafter"|null, loginAs: (role: string) => Promise<object>, logout: () => void }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
