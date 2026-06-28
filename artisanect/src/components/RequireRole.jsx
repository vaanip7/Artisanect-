import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * RequireRole
 * Route guard. Redirects to /login if no one is logged in, or if a
 * specific role is required and the current user doesn't have it.
 *
 * @param {Object} props
 * @param {"customer"|"crafter"} [props.role] - Required role. Omit to just require any logged-in user.
 * @param {React.ReactNode} props.children - The protected route content.
 * @returns {JSX.Element}
 */
function RequireRole({ role, children }) {
  const { role: currentRole } = useAuth();

  if (!currentRole) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) return <Navigate to="/login" replace />;

  return children;
}

export default RequireRole;
