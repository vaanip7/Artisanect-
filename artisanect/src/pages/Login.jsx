import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Loader, showSuccessToast, showErrorToast } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * DEMO credentials baked in so the evaluator can log in with one click.
 * These match exactly what prisma/seed.js creates.
 */
const DEMO_ACCOUNTS = [
  {
    role:        "customer",
    label:       "Customer",
    tagline:     "Browse & shop handcrafted products",
    email:       "customer@artisanect.com",
    password:    "Customer@123",
    icon:        "M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H18M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    features: ["Browse 24+ handmade products", "Save wishlist & manage cart", "Track your orders"],
  },
  {
    role:        "crafter",
    label:       "Crafter",
    tagline:     "List products & manage your store",
    email:       "crafter@artisanect.com",
    password:    "Crafter@123",
    icon:        "M12 2v6m0 0L8 5m4 3 4-3M5 11h14l1 9H4l1-9Z",
    features: ["Upload & manage products", "View incoming orders", "Track revenue & stock"],
  },
];

const trustStats = [
  { label: "Handcrafted products", value: "24+" },
  { label: "Craft categories",     value: "8" },
  { label: "Platform cut",         value: "0%" },
];

/**
 * Login
 *
 * The front door of Artisanect.
 *
 * The page is split into two halves:
 *  1. A full-bleed hero that explains what Artisanect is, so first-time
 *     visitors immediately understand the context.
 *  2. A two-card role selector that doubles as a quick-login shortcut:
 *     clicking a role card pre-fills the email + password for that demo
 *     account, so the evaluator can test both roles in seconds.
 *
 * A manual login form (email + password) sits below the cards and is also
 * updated whenever a card is clicked, so the user can see what credentials
 * are being used and change them if they have a real account.
 *
 * @returns {JSX.Element}
 */
function Login() {
  const { role: currentRole, login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Already logged in? Skip this screen entirely.
  if (!isLoading && currentRole === "crafter")  return <Navigate to="/dashboard" replace />;
  if (!isLoading && currentRole === "customer") return <Navigate to="/" replace />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-ink">
        <Loader size="lg" label="Checking session…" />
      </div>
    );
  }

  /** Clicking a role card pre-fills the demo credentials for that role. */
  function handleCardClick(demo) {
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword(demo.password);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      showErrorToast("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { user } = await login(email, password);
      showSuccessToast(`Welcome back, ${user.name}!`);
      navigate(user.role === "CRAFTER" ? "/dashboard" : "/");
    } catch (err) {
      showErrorToast(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-ink">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&w=1600&q=65"
              alt="Artisan at work"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/95 to-ink" />
          </div>

          <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-14 sm:py-20 flex flex-col items-center text-center gap-5">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-gold border border-gold/40 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              Handmade · Verified Artisans · Direct from the Maker
            </span>

            <h1 className="font-display font-bold text-3xl sm:text-5xl text-paper leading-tight">
              Welcome to Artisanect
            </h1>

            <p className="text-sm sm:text-base text-paper/75 max-w-xl leading-relaxed">
              A marketplace connecting skilled artisans directly with people who value handmade
              craft — pottery, textiles, woodwork, jewellery, and more. No middlemen.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-1">
              {trustStats.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && <span className="hidden sm:block w-px h-7 bg-paper/15" />}
                  <div className="text-center">
                    <div className="font-display font-bold text-xl text-gold-light">{stat.value}</div>
                    <div className="text-[10px] text-paper/55 uppercase tracking-wide">{stat.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="h-[2px] stitch-divider-light" />
        </section>

        {/* ── Role cards + login form ───────────────────────────────────────── */}
        <section className="px-5 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">

            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-paper">
                Sign in to your account
              </h2>
              <p className="text-sm text-ink/55 dark:text-paper/55 mt-1">
                Click a card to auto-fill demo credentials, then hit <strong>Login</strong>.
              </p>
            </div>

            {/* Two role quick-login cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {DEMO_ACCOUNTS.map((demo) => {
                const isActive = selectedRole === demo.role;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleCardClick(demo)}
                    className={`group text-left flex flex-col rounded-2xl border-2 p-6 transition-all duration-200 cursor-pointer
                      ${isActive
                        ? "border-clay bg-clay/5 dark:bg-clay/10 shadow-lg -translate-y-0.5"
                        : "border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light hover:border-clay/60 hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                        ${isActive ? "bg-clay/20 text-clay" : "bg-clay/10 text-clay dark:bg-clay/20"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={demo.icon} />
                        </svg>
                      </div>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-clay bg-clay/10 rounded-full px-2.5 py-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Selected
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-semibold text-base text-ink dark:text-paper mb-1">
                      Login as {demo.label}
                    </h3>
                    <p className="text-xs text-ink/55 dark:text-paper/55 mb-4">{demo.tagline}</p>

                    <ul className="space-y-1.5 mb-4 flex-1">
                      {demo.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-ink/65 dark:text-paper/65">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-clay flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Show demo credentials inline on the card */}
                    <div className="rounded-lg bg-ink/5 dark:bg-paper/5 px-3 py-2 text-xs font-mono text-ink/60 dark:text-paper/60 space-y-0.5">
                      <div><span className="text-ink/40 dark:text-paper/40">email  </span>{demo.email}</div>
                      <div><span className="text-ink/40 dark:text-paper/40">pass   </span>{demo.password}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── The actual email/password form ─────────────────────────── */}
            <div className="max-w-md mx-auto">
              <div className="bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-2xl p-7 shadow-sm">
                <h3 className="font-display font-semibold text-base text-ink dark:text-paper mb-5">
                  {selectedRole
                    ? `Logging in as ${selectedRole === "customer" ? "Customer" : "Crafter"}`
                    : "Login with your credentials"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="login-email" className="block text-xs font-medium text-ink/60 dark:text-paper/60 mb-1.5 uppercase tracking-wide">
                      Email address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-ink/15 dark:border-paper/15 bg-paper dark:bg-ink/60 text-ink dark:text-paper px-4 py-2.5 text-sm placeholder:text-ink/30 dark:placeholder:text-paper/30 focus:outline-none focus:border-clay transition-colors"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="login-password" className="block text-xs font-medium text-ink/60 dark:text-paper/60 mb-1.5 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-ink/15 dark:border-paper/15 bg-paper dark:bg-ink/60 text-ink dark:text-paper px-4 py-2.5 pr-11 text-sm placeholder:text-ink/30 dark:placeholder:text-paper/30 focus:outline-none focus:border-clay transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-paper/40 hover:text-ink dark:hover:text-paper"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-clay hover:bg-clay-dark text-paper font-semibold text-sm rounded-lg py-3 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader size="sm" /><span>Signing in…</span></>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                        </svg>
                        Login
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-ink/40 dark:text-paper/40 mt-4">
                  Demo app — click a role card above to auto-fill credentials.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Login;
