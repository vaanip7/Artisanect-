import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  loginWithCredentials,
  fetchCurrentUser,
  setToken,
  clearToken,
  getToken,
} from "../services/api.js";

// ─── Storage keys ──────────────────────────────────────────────────────────────

const USER_KEY = "artisanect_user";

function persistUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(USER_KEY);
}

function loadPersistedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

/**
 * AuthProvider
 *
 * Manages authentication state across the whole app:
 *  • Persists the JWT and user profile in localStorage so sessions survive
 *    page refreshes.
 *  • Re-validates the stored token against the backend on mount so a deleted
 *    or expired token is cleared automatically.
 *  • Exposes `login`, `logout`, and reactive `user` / `role` values that
 *    every page and context consumer can subscribe to.
 */
export function AuthProvider({ children }) {
  const [user,     setUser]     = useState(loadPersistedUser);
  const [isLoading, setIsLoading] = useState(!!getToken()); // true only if we need to re-validate

  // On first mount, if there's a token in localStorage, hit /auth/me to
  // confirm it's still valid.  This catches expired tokens, revoked sessions,
  // or a full database reset after seeding.
  useEffect(() => {
    if (!getToken()) { setIsLoading(false); return; }

    fetchCurrentUser()
      .then((freshUser) => {
        setUser(freshUser);
        persistUser(freshUser);
      })
      .catch(() => {
        // Token is stale — sign the user out silently.
        clearToken();
        clearUser();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * login — calls /api/auth/login, stores the JWT + user profile, and
   * updates the context so every subscriber re-renders with the new role.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ user: object, token: string }>}
   */
  const login = useCallback(async (email, password) => {
    const { user: loggedInUser, token } = await loginWithCredentials(email, password);
    setToken(token);
    persistUser(loggedInUser);
    setUser(loggedInUser);
    return { user: loggedInUser, token };
  }, []);

  /**
   * logout — clears all stored state and resets the context.
   */
  const logout = useCallback(() => {
    clearToken();
    clearUser();
    setUser(null);
  }, []);

  const value = {
    user,
    token:           getToken(),
    isAuthenticated: !!user,
    role:            user ? user.role.toLowerCase() : null, // "customer" | "crafter"
    isLoading,
    login,
    logout,
    // Legacy alias kept so any code still calling loginAs() gets a
    // clear error during development rather than a silent no-op.
    loginAs: () => {
      throw new Error("AuthContext: loginAs() removed. Use login(email, password) instead.");
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — React hook that returns the auth context.
 * Must be used inside an <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
