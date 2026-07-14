import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "../components/ui/index.js";
import { setToken } from "../services/api.js";
import { showSuccessToast, showErrorToast } from "../components/ui/index.js";

/**
 * AuthCallback
 *
 * Landing page after Google OAuth.
 * The backend redirects here with token + user info as URL params:
 *   /auth/callback?token=xxx&id=xxx&name=xxx&email=xxx&role=xxx
 *
 * We store the JWT in localStorage (same format as regular login)
 * then redirect to the correct dashboard.
 */
function AuthCallback() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      showErrorToast("Google login failed. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    // Build the user object from URL params
    const user = {
      id:    params.get("id"),
      name:  params.get("name"),
      email: params.get("email"),
      role:  params.get("role"),
    };

    // Store exactly the same way normal login does
    setToken(token);
    localStorage.setItem("artisanect_user", JSON.stringify(user));

    showSuccessToast(`Welcome, ${user.name}!`);

    // Redirect based on role
    if (user.role === "CRAFTER") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper dark:bg-ink gap-4">
      <Loader size="lg" label="Completing Google sign-in…" />
    </div>
  );
}

export default AuthCallback;
