import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader } from "./ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 * - If still checking session (isLoading) → shows a spinner
 * - If not logged in → redirects to /login, remembers where they were going
 * - If role is specified and doesn't match → redirects to /login
 * - Otherwise → renders children normally
 *
 * Usage:
 *   <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
 *   <Route path="/dashboard" element={<ProtectedRoute role="crafter"><Dashboard /></ProtectedRoute>} />
 *
 * @param {{ children: React.ReactNode, role?: "customer"|"crafter" }} props
 */
function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: currentRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-ink">
        <Loader size="lg" label="Checking session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save where the user was trying to go so we can redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && currentRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
