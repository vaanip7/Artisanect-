import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Login", path: "/login" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "UI Kit", path: "/components-demo" },
];

/**
 * Navbar
 * Sticky site navigation with the Artisanect logo, a responsive mobile
 * menu, and a light/dark theme toggle button. Active routes are
 * highlighted via React Router's NavLink.
 *
 * @returns {JSX.Element}
 */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const linkClasses = ({ isActive }) =>
    `font-medium transition-colors hover:text-clay ${
      isActive ? "text-clay" : "text-ink dark:text-paper"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-paper/95 dark:bg-ink/95 backdrop-blur-sm border-b-2 border-dashed border-ink/15 dark:border-paper/15 transition-colors duration-300">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="w-9 h-9 rounded-full bg-clay flex items-center justify-center text-paper font-display font-bold text-sm">
            A
          </span>
          <span className="font-display font-bold text-lg sm:text-xl text-ink dark:text-paper tracking-tight">
            Artisanect
          </span>
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} className={linkClasses}>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-ink/15 dark:border-paper/20 text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-ink/15 dark:border-paper/20 text-ink dark:text-paper"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="md:hidden border-t border-ink/10 dark:border-paper/10 bg-paper dark:bg-ink">
          <ul className="flex flex-col px-5 py-3 gap-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block w-full py-2.5 px-2 rounded-md font-medium ${
                      isActive
                        ? "text-clay bg-clay/10"
                        : "text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/10"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
