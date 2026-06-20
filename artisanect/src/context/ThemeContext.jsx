import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

const STORAGE_KEY = "artisanect-theme";

/**
 * ThemeProvider
 * Provides app-wide light/dark theme state. On mount it reads the saved
 * theme from localStorage (falling back to the OS color-scheme preference),
 * applies/removes the `dark` class on the root <html> element so Tailwind's
 * `dark:` variants take effect, and persists every change back to
 * localStorage so the theme survives a page refresh.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - App content that should have access to the theme.
 * @returns {JSX.Element}
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  /** Flips the current theme between "light" and "dark". */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme
 * Hook for accessing the current theme and the toggle function.
 * Must be called from a component rendered inside <ThemeProvider>.
 *
 * @returns {{ theme: "light"|"dark", toggleTheme: () => void, setTheme: (t: "light"|"dark") => void }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
