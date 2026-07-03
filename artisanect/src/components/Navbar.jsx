import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const guestLinks = [
  { name: "Home",  path: "/" },
  { name: "About", path: "/about" },
  { name: "Shop",  path: "/shop" },
];

const customerLinks = [
  { name: "Home",     path: "/" },
  { name: "Shop",     path: "/shop" },
  { name: "Cart",     path: "/cart" },
  { name: "Wishlist", path: "/wishlist" },
  { name: "Profile",  path: "/profile" },
];

const crafterLinks = [
  { name: "Dashboard",      path: "/dashboard" },
  { name: "Upload Product", path: "/crafter/upload" },
  { name: "My Products",    path: "/crafter/products" },
  { name: "Orders",         path: "/crafter/orders" },
  { name: "Profile",        path: "/profile" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { role, user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const navLinks = role === "customer" ? customerLinks : role === "crafter" ? crafterLinks : guestLinks;
  const linkClass = ({ isActive }) =>
    `font-medium transition-colors hover:text-clay ${isActive ? "text-clay" : "text-ink dark:text-paper"}`;

  function handleLogout() {
    logout();
    setIsOpen(false);
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 bg-paper/95 dark:bg-ink/95 backdrop-blur-sm border-b-2 border-dashed border-ink/15 dark:border-paper/15 transition-colors duration-300">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="w-9 h-9 rounded-full bg-clay flex items-center justify-center text-paper font-display font-bold text-sm">A</span>
          <span className="font-display font-bold text-lg sm:text-xl text-ink dark:text-paper tracking-tight">Artisanect</span>
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <li key={link.path} className="relative">
              <NavLink to={link.path} className={linkClass}>{link.name}</NavLink>
              {link.name === "Cart" && count > 0 && (
                <span className="absolute -top-2 -right-3 bg-clay text-paper text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count}</span>
              )}
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {role && user && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-semibold text-ink dark:text-paper leading-none">{user.name}</p>
                <p className="text-[10px] text-ink/50 dark:text-paper/50 capitalize">{role}</p>
              </div>
              <button onClick={handleLogout}
                className="text-xs font-semibold text-ink/60 dark:text-paper/60 hover:text-clay transition-colors border border-ink/15 dark:border-paper/20 rounded-md px-3 py-1.5">
                Logout
              </button>
            </div>
          )}
          {!role && (
            <NavLink to="/login" className="hidden sm:inline text-sm font-semibold text-ink dark:text-paper hover:text-clay transition-colors">Login</NavLink>
          )}

          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle theme"
            className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-ink/15 dark:border-paper/20 text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors">
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

          {/* Mobile burger */}
          <button onClick={() => setIsOpen(p => !p)} aria-label="Menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-ink/15 dark:border-paper/20 text-ink dark:text-paper">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-ink/10 dark:border-paper/10 bg-paper dark:bg-ink">
          {role && user && (
            <div className="px-5 py-3 border-b border-ink/10 dark:border-paper/10">
              <p className="text-sm font-semibold text-ink dark:text-paper">{user.name}</p>
              <p className="text-xs text-ink/50 dark:text-paper/50 capitalize">{role} account</p>
            </div>
          )}
          <ul className="flex flex-col px-5 py-3 gap-1">
            {navLinks.map(link => (
              <li key={link.path}>
                <NavLink to={link.path} onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between w-full py-2.5 px-2 rounded-md font-medium ${
                      isActive ? "text-clay bg-clay/10" : "text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/10"
                    }`}>
                  {link.name}
                  {link.name === "Cart" && count > 0 && (
                    <span className="bg-clay text-paper text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
                  )}
                </NavLink>
              </li>
            ))}
            <li>
              {role ? (
                <button onClick={handleLogout}
                  className="block w-full text-left py-2.5 px-2 rounded-md font-medium text-clay hover:bg-clay/10">
                  Logout
                </button>
              ) : (
                <NavLink to="/login" onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 px-2 rounded-md font-medium text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/10">
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
