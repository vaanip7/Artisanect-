import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Loader, showSuccessToast, showErrorToast } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";

const roleCards = [
  {
    role: "customer",
    title: "Login as Customer",
    description: "Browse handcrafted products, manage your cart and wishlist, and track orders.",
    icon: "M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H18M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  },
  {
    role: "crafter",
    title: "Login as Crafter",
    description: "Upload and manage your products, view orders received, and grow your craft business.",
    icon: "M12 2v6m0 0L8 5m4 3 4-3M5 11h14l1 9H4l1-9Z",
  },
];

/**
 * Login
 * Role-selection login page. Artisanect has two kinds of accounts —
 * customers and crafters — so instead of a single form, the person
 * picks which role to continue as. Login is a dummy call (no real
 * passwords yet) that sets the role in AuthContext and redirects.
 *
 * @returns {JSX.Element}
 */
function Login() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);

  async function handleLogin(role) {
    setLoadingRole(role);
    try {
      await loginAs(role);
      showSuccessToast(`Logged in as ${role}`);
      navigate(role === "crafter" ? "/dashboard" : "/");
    } catch (err) {
      showErrorToast(err.message || "Login failed. Is the backend running?");
    } finally {
      setLoadingRole(null);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-5 py-16 sm:py-24 bg-paper dark:bg-ink transition-colors duration-300">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-10">
            <span className="inline-flex w-12 h-12 rounded-full bg-clay items-center justify-center text-paper font-display font-bold text-lg mb-3">
              A
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-paper">Welcome to Artisanect</h1>
            <p className="text-sm text-ink/60 dark:text-paper/60 mt-1">Choose how you&apos;d like to continue</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {roleCards.map((card) => (
              <button
                key={card.role}
                type="button"
                onClick={() => handleLogin(card.role)}
                disabled={loadingRole !== null}
                className="text-left bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-2xl p-7 hover:border-clay hover:shadow-lg transition-all duration-300 disabled:opacity-60"
              >
                <div className="w-12 h-12 rounded-lg bg-clay/10 dark:bg-clay/20 flex items-center justify-center text-clay mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
                <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-2">{card.title}</h2>
                <p className="text-sm text-ink/60 dark:text-paper/60 leading-relaxed">{card.description}</p>

                {loadingRole === card.role && (
                  <div className="mt-4">
                    <Loader size="sm" label="Logging in..." />
                  </div>
                )}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-ink/45 dark:text-paper/45 mt-8">
            This is a demo login — no real password is required.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;
