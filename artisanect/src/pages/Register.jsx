import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Loader, showSuccessToast, showErrorToast } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { registerUser } from "../services/api.js";
import { setToken } from "../services/api.js";

const craftOptions = [
  "Pottery", "Wood Carving", "Textile", "Jewellery",
  "Painting", "Leather", "Wellness", "Home Decor", "Other",
];

function Register() {
  const { role: currentRole, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: "CUSTOMER", craft: "",
  });
  const [showPassword, setShowPassword]   = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [errors, setErrors]               = useState({});

  if (currentRole === "crafter")  return <Navigate to="/dashboard" replace />;
  if (currentRole === "customer") return <Navigate to="/" replace />;

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())                  errs.name     = "Name is required.";
    if (!form.email.trim())                 errs.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password)                     errs.password = "Password is required.";
    else if (form.password.length < 6)      errs.password = "Password must be at least 6 characters.";
    else if (!/[A-Z]/.test(form.password))  errs.password = "Password needs at least one uppercase letter.";
    else if (!/[0-9]/.test(form.password))  errs.password = "Password needs at least one number.";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (form.role === "CRAFTER" && !form.craft) errs.craft = "Please select your primary craft.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsSubmitting(true);
    try {
      const data = await registerUser({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        role:     form.role,
        craft:    form.role === "CRAFTER" ? form.craft : undefined,
      });
      // Store token + user in AuthContext the same way login() does
      setToken(data.token);
      localStorage.setItem("artisanect_user", JSON.stringify(data.user));
      window.location.href = data.user.role === "CRAFTER" ? "/dashboard" : "/";
      showSuccessToast(`Welcome to Artisanect, ${data.user.name}!`);
    } catch (err) {
      showErrorToast(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass = (name) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm bg-paper dark:bg-ink/60 text-ink dark:text-paper
     placeholder:text-ink/30 dark:placeholder:text-paper/30 focus:outline-none transition-colors
     ${errors[name]
       ? "border-red-400 focus:border-red-500"
       : "border-ink/15 dark:border-paper/15 focus:border-clay"}`;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">

        {/* Hero */}
        <section className="relative overflow-hidden bg-ink py-12 sm:py-16">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&w=1600&q=65"
              alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/95 to-ink" />
          </div>
          <div className="relative max-w-xl mx-auto px-5 text-center">
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper mb-2">
              Create your account
            </h1>
            <p className="text-sm text-paper/70">
              Join Artisanect as a customer or artisan — it's free.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="px-5 py-12 sm:py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-2xl p-7 shadow-sm">

              {/* Role toggle */}
              <div className="flex rounded-lg border border-ink/15 dark:border-paper/15 overflow-hidden mb-6">
                {["CUSTOMER", "CRAFTER"].map(r => (
                  <button key={r} type="button"
                    onClick={() => setForm(p => ({ ...p, role: r }))}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-colors
                      ${form.role === r
                        ? "bg-clay text-paper"
                        : "text-ink/60 dark:text-paper/60 hover:bg-ink/5 dark:hover:bg-paper/5"
                      }`}>
                    {r === "CUSTOMER" ? "I want to shop" : "I want to sell"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 dark:text-paper/55 mb-1.5">Full Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder="e.g. Asha Mehta" autoComplete="name" className={fieldClass("name")} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 dark:text-paper/55 mb-1.5">Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" autoComplete="email" className={fieldClass("email")} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Craft (crafter only) */}
                {form.role === "CRAFTER" && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 dark:text-paper/55 mb-1.5">Primary Craft</label>
                    <select name="craft" value={form.craft} onChange={handleChange} className={fieldClass("craft")}>
                      <option value="">Select your craft…</option>
                      {craftOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.craft && <p className="text-red-500 text-xs mt-1">{errors.craft}</p>}
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 dark:text-paper/55 mb-1.5">Password</label>
                  <div className="relative">
                    <input name="password" type={showPassword ? "text" : "password"}
                      value={form.password} onChange={handleChange}
                      placeholder="Min 6 chars, 1 uppercase, 1 number"
                      autoComplete="new-password" className={fieldClass("password")} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-paper/40 hover:text-ink dark:hover:text-paper">
                      {showPassword
                        ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      }
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 dark:text-paper/55 mb-1.5">Confirm Password</label>
                  <input name="confirmPassword" type={showPassword ? "text" : "password"}
                    value={form.confirmPassword} onChange={handleChange}
                    placeholder="Repeat your password" autoComplete="new-password"
                    className={fieldClass("confirmPassword")} />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Submit */}
                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-clay hover:bg-clay-dark text-paper font-semibold text-sm rounded-lg py-3 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                  {isSubmitting
                    ? <><Loader size="sm" /><span>Creating account…</span></>
                    : "Create Account"
                  }
                </button>
              </form>

              <p className="text-center text-xs text-ink/45 dark:text-paper/45 mt-5">
                Already have an account?{" "}
                <Link to="/login" className="text-clay font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Register;
